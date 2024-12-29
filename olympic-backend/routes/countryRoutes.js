const express = require('express');
const Country = require('../models/Country');
const Medal = require('../models/Medal');
const router = express.Router();

// 获取所有国家
router.get('/', async (req, res) => {
  try {
    const countries = await Country.findAll();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching countries', error: err });
  }
});

// 获取特定国家详情
router.get('/:id', async (req, res) => {
  try {
    const country = await Country.findByPk(req.params.id);
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }

    const medals = await Medal.findOne({ where: { country_id: country.id } });
    res.json({ country, medals });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching country details', error: err });
  }
});

module.exports = router;
