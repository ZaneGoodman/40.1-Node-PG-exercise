const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res, next) => {
  // List all invoices
  try {
    const results = await db.query(`SELECT * FROM invoices`);
    return res.json({ invoices: results.rows });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  // Get invoice with a matching id
  try {
    const { id } = req.params;
    const result = await db.query(`SELECT * FROM invoices WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      throw new ExpressError(`Canno't find invoice with id of: ${id}`, 404);
    }
    return res.json({ invoice: result.rows });
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  // Create a new invoice
  try {
    const { comp_code, amt } = req.body;
    const result = await db.query(
      `INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *`,
      [comp_code, amt]
    );
    return res.status(201).json({ invoice: result.rows[0] });
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  // Update an invoice amount
  try {
    const { amt } = req.body;
    const { id } = req.params;
    const result = await db.query(
      `UPDATE invoices SET amt = $1 WHERE id = $2 RETURNING *`,
      [amt, id]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(`Can not find invoice with id of: ${id}`, 404);
    }
    return res.json({ invoice: result.rows[0] });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  // Delete and invoice
  try {
    const { id } = req.params;
    const result = await db.query(
      `DELETE FROM invoices WHERE id = $1 RETURNING id`,
      [id]
    );
    if (result.rows.length === 0) {
      throw new ExpressError(`Can not find invoice with id of: ${id}`, 404);
    }
    return res.send({ msg: "invoice delted successfuly" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
