const db = require('../config/db');

// 获取所有国家
const getAllCountries = (req, res) => {
  db.query('SELECT * FROM countries ORDER BY gold DESC', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};

// 获取国家详细信息
const getCountryDetails = (req, res) => {
  const { name } = req.params;

  db.query('SELECT * FROM countries WHERE name = ?', [name], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send('Country not found.');

    const country = result[0];
    db.query('SELECT * FROM sports WHERE countryId = ?', [country.id], (err, sports) => {
      if (err) return res.status(500).send(err);
      res.json({ ...country, sports });
    });
  });
};

module.exports = { getAllCountries, getCountryDetails };
