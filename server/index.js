require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'pitchmaster',
  waitForConnections: true,
  connectionLimit: 10,
});

// ============ 登录 API ============
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: '请输入用户名和密码' });
    }
    const [rows] = await pool.query(
      'SELECT id, username, display_name, role FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: '用户名或密码错误' });
    }
    const user = rows[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============ 球员 API ============
// 获取所有球员
app.get('/api/players', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, 
        COALESCE(SUM(s.goals), 0) as total_goals,
        COALESCE(SUM(s.assists), 0) as total_assists,
        COALESCE(SUM(s.is_mvp), 0) as mvp_count,
        COUNT(DISTINCT s.match_id) as matches_played
      FROM players p
      LEFT JOIN match_stats s ON p.id = s.player_id
      GROUP BY p.id
      ORDER BY p.rating DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 添加球员
app.post('/api/players', async (req, res) => {
  try {
    const { name, preferred_position, rating } = req.body;
    const [result] = await pool.query(
      'INSERT INTO players (name, preferred_position, rating) VALUES (?, ?, ?)',
      [name, preferred_position, rating || 75]
    );
    res.json({ id: result.insertId, name, preferred_position, rating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 删除球员
app.delete('/api/players/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM players WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ 比赛 API ============
// 获取所有比赛
app.get('/api/matches', async (req, res) => {
  try {
    const { date } = req.query;
    let query = `
      SELECT m.*, 
        COUNT(DISTINCT r.player_id) as registered_count
      FROM matches m
      LEFT JOIN match_registrations r ON m.id = r.match_id
    `;
    const params = [];
    if (date) {
      query += ' WHERE DATE(m.match_date) = ? ';
      params.push(date);
    }
    query += ' GROUP BY m.id ORDER BY m.created_at DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取单场比赛详情
app.get('/api/matches/:id', async (req, res) => {
  try {
    const [[match]] = await pool.query('SELECT * FROM matches WHERE id = ?', [req.params.id]);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    const [registrations] = await pool.query(`
      SELECT r.*, p.name as player_name, p.avatar, p.preferred_position, p.rating
      FROM match_registrations r
      JOIN players p ON r.player_id = p.id
      WHERE r.match_id = ?
    `, [req.params.id]);

    const [stats] = await pool.query(`
      SELECT s.*, p.name
      FROM match_stats s
      JOIN players p ON s.player_id = p.id
      WHERE s.match_id = ?
    `, [req.params.id]);

    res.json({ ...match, registrations, stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 创建比赛
app.post('/api/matches', async (req, res) => {
  try {
    const { match_date, match_time, location, format } = req.body;
    const [result] = await pool.query(
      'INSERT INTO matches (match_date, match_time, location, format) VALUES (?, ?, ?, ?)',
      [match_date, match_time || null, location || '', format || '5v5']
    );
    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 更新比赛状态
app.put('/api/matches/:id', async (req, res) => {
  try {
    const { status, home_score, away_score, formation } = req.body;
    await pool.query(
      'UPDATE matches SET status = ?, home_score = ?, away_score = ?, formation = ? WHERE id = ?',
      [status, home_score || 0, away_score || 0, formation, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 删除比赛
app.delete('/api/matches/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM matches WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ 报名 API ============
// 球员报名比赛
app.post('/api/matches/:id/register', async (req, res) => {
  try {
    const { player_id } = req.body;
    await pool.query(
      'INSERT INTO match_registrations (match_id, player_id) VALUES (?, ?)',
      [req.params.id, player_id]
    );
    res.json({ success: true });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: '该球员已报名' });
    }
    res.status(500).json({ error: err.message });
  }
});

// 取消报名
app.delete('/api/matches/:id/register/:playerId', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM match_registrations WHERE match_id = ? AND player_id = ?',
      [req.params.id, req.params.playerId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ 比赛数据 API ============
// 录入/更新球员比赛数据
app.post('/api/matches/:id/stats', async (req, res) => {
  try {
    const { player_id, goals, assists, yellow_cards, red_cards, is_mvp } = req.body;
    await pool.query(`
      INSERT INTO match_stats (match_id, player_id, goals, assists, yellow_cards, red_cards, is_mvp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        goals = VALUES(goals),
        assists = VALUES(assists),
        yellow_cards = VALUES(yellow_cards),
        red_cards = VALUES(red_cards),
        is_mvp = VALUES(is_mvp)
    `, [req.params.id, player_id, goals || 0, assists || 0, yellow_cards || 0, red_cards || 0, is_mvp || false]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ 批量操作 API ============
// 批量导入球员到比赛 (创建球员 + 注册到比赛)
app.post('/api/matches/:id/import-players', async (req, res) => {
  try {
    const { players } = req.body; // [{ name, preferred_position, rating }]
    const matchId = req.params.id;
    const results = [];

    for (const p of players) {
      // Check if player exists by name
      const [existing] = await pool.query('SELECT id FROM players WHERE name = ?', [p.name]);
      let playerId;

      if (existing.length > 0) {
        playerId = existing[0].id;
      } else {
        const [result] = await pool.query(
          'INSERT INTO players (name, preferred_position, rating) VALUES (?, ?, ?)',
          [p.name, p.preferred_position || 'MF', p.rating || 75]
        );
        playerId = result.insertId;
      }

      // Register to match (ignore duplicate)
      try {
        await pool.query(
          'INSERT INTO match_registrations (match_id, player_id, position_index, is_starter) VALUES (?, ?, ?, ?)',
          [matchId, playerId, p.position_index !== undefined ? p.position_index : null, p.is_starter ? 1 : 0]
        );
      } catch (e) {
        // Ignore duplicate registration - update position if already exists
        if (e.code === 'ER_DUP_ENTRY') {
          await pool.query(
            'UPDATE match_registrations SET position_index = ?, is_starter = ? WHERE match_id = ? AND player_id = ?',
            [p.position_index !== undefined ? p.position_index : null, p.is_starter ? 1 : 0, matchId, playerId]
          );
        }
      }

      results.push({ name: p.name, playerId });
    }

    res.json({ success: true, players: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 批量保存赛后数据
app.post('/api/matches/:id/batch-stats', async (req, res) => {
  try {
    const { stats, home_score, away_score, formation } = req.body;
    const matchId = req.params.id;

    // Update match status
    await pool.query(
      'UPDATE matches SET status = ?, home_score = ?, away_score = ?, formation = ? WHERE id = ?',
      ['completed', home_score || 0, away_score || 0, formation || null, matchId]
    );

    // Save each player's stats
    for (const s of stats) {
      // Find player by name
      const [existing] = await pool.query('SELECT id FROM players WHERE name = ?', [s.playerName]);
      if (existing.length === 0) continue;

      const playerId = existing[0].id;

      await pool.query(`
        INSERT INTO match_stats (match_id, player_id, goals, assists, yellow_cards, red_cards, is_mvp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          goals = VALUES(goals),
          assists = VALUES(assists),
          yellow_cards = VALUES(yellow_cards),
          red_cards = VALUES(red_cards),
          is_mvp = VALUES(is_mvp)
      `, [matchId, playerId, s.goals || 0, s.assists || 0, s.yellowCards || 0, s.redCards || 0, s.isMVP || false]);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取球员统计
app.get('/api/stats/leaderboard', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.name, p.preferred_position, p.rating,
        COALESCE(SUM(s.goals), 0) as total_goals,
        COALESCE(SUM(s.assists), 0) as total_assists,
        COALESCE(SUM(s.yellow_cards), 0) as total_yellows,
        COALESCE(SUM(s.red_cards), 0) as total_reds,
        COALESCE(SUM(s.is_mvp), 0) as mvp_count,
        COUNT(DISTINCT s.match_id) as matches_played
      FROM players p
      LEFT JOIN match_stats s ON p.id = s.player_id
      GROUP BY p.id
      ORDER BY total_goals DESC, total_assists DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`金龙球员花名册 API running on http://localhost:${PORT}`);
});

