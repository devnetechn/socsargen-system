const pool = require('../config/database');

// Get active awards (public)
// Supports: ?limit=3 (for home page), ?month=2026-03 (filter by month)
const getActiveAwards = async (req, res) => {
  try {
    const { limit, month } = req.query;

    let query = `
      SELECT id, title, recipient, description, photo_url, votes, color_theme, display_order, award_month
      FROM patient_awards
      WHERE is_active = true
    `;
    const params = [];

    if (month) {
      params.push(month + '-01');
      query += ` AND DATE_TRUNC('month', award_month) = DATE_TRUNC('month', $${params.length}::date)`;
    }

    query += ' ORDER BY display_order ASC, created_at DESC';

    if (limit) {
      params.push(parseInt(limit));
      query += ` LIMIT $${params.length}`;
    }

    const result = await pool.query(query, params);

    res.json(result.rows.map(a => ({
      id: a.id,
      title: a.title,
      recipient: a.recipient,
      description: a.description,
      photoUrl: a.photo_url,
      votes: a.votes,
      colorTheme: a.color_theme,
      displayOrder: a.display_order,
      awardMonth: a.award_month
    })));
  } catch (error) {
    console.error('Get awards error:', error);
    res.status(500).json({ error: 'Failed to fetch awards.' });
  }
};

// Get available months (for filter dropdown)
const getAwardMonths = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT DATE_TRUNC('month', award_month) as month
      FROM patient_awards
      WHERE is_active = true
      ORDER BY month DESC
    `);

    res.json(result.rows.map(r => r.month));
  } catch (error) {
    console.error('Get award months error:', error);
    res.status(500).json({ error: 'Failed to fetch award months.' });
  }
};

// Admin: Get all awards
const getAllAwards = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM patient_awards ORDER BY award_month DESC, display_order ASC, created_at DESC
    `);

    res.json(result.rows.map(a => ({
      id: a.id,
      title: a.title,
      recipient: a.recipient,
      description: a.description,
      photoUrl: a.photo_url,
      votes: a.votes,
      colorTheme: a.color_theme,
      displayOrder: a.display_order,
      isActive: a.is_active,
      awardMonth: a.award_month,
      createdAt: a.created_at
    })));
  } catch (error) {
    console.error('Get all awards error:', error);
    res.status(500).json({ error: 'Failed to fetch awards.' });
  }
};

// Admin: Create award
const createAward = async (req, res) => {
  try {
    const { title, recipient, description, photoUrl, votes, colorTheme, displayOrder, awardMonth } = req.body;

    const result = await pool.query(
      `INSERT INTO patient_awards (title, recipient, description, photo_url, votes, color_theme, display_order, award_month)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, recipient, description || null, photoUrl || null, votes || 0, colorTheme || 'amber', displayOrder || 0, awardMonth || new Date()]
    );

    res.status(201).json({
      message: 'Award created successfully!',
      award: result.rows[0]
    });
  } catch (error) {
    console.error('Create award error:', error);
    res.status(500).json({ error: 'Failed to create award.' });
  }
};

// Admin: Update award
const updateAward = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, recipient, description, photoUrl, votes, colorTheme, displayOrder, isActive, awardMonth } = req.body;

    const fields = [];
    const params = [];
    let idx = 1;

    if (title !== undefined) { fields.push(`title = $${idx++}`); params.push(title); }
    if (recipient !== undefined) { fields.push(`recipient = $${idx++}`); params.push(recipient); }
    if (description !== undefined) { fields.push(`description = $${idx++}`); params.push(description); }
    if (photoUrl !== undefined) { fields.push(`photo_url = $${idx++}`); params.push(photoUrl || null); }
    if (votes !== undefined) { fields.push(`votes = $${idx++}`); params.push(votes); }
    if (colorTheme !== undefined) { fields.push(`color_theme = $${idx++}`); params.push(colorTheme); }
    if (displayOrder !== undefined) { fields.push(`display_order = $${idx++}`); params.push(displayOrder); }
    if (isActive !== undefined) { fields.push(`is_active = $${idx++}`); params.push(isActive); }
    if (awardMonth !== undefined) { fields.push(`award_month = $${idx++}`); params.push(awardMonth); }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const result = await pool.query(
      `UPDATE patient_awards SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Award not found.' });
    }

    res.json({ message: 'Award updated successfully!', award: result.rows[0] });
  } catch (error) {
    console.error('Update award error:', error);
    res.status(500).json({ error: 'Failed to update award.' });
  }
};

// Admin: Delete award
const deleteAward = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM patient_awards WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Award not found.' });
    }

    res.json({ message: 'Award deleted successfully!' });
  } catch (error) {
    console.error('Delete award error:', error);
    res.status(500).json({ error: 'Failed to delete award.' });
  }
};

module.exports = {
  getActiveAwards,
  getAwardMonths,
  getAllAwards,
  createAward,
  updateAward,
  deleteAward
};
