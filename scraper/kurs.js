const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;

const fetchKurs = async () => {
  try {
    const { data } = await axios.get('https://www.bi.go.id/id/statistik/informasi-kurs/transaksi-bi/default.aspx');
    const $ = cheerio.load(data);
    const uang = [];
    const result = [];

    $('#exampleModal > div > div > div.modal-body > div > table > tbody > tr').each((i, element) => {
      if (i < 25) {
        const data = $(element).find('td');
        uang.push({
          singkatan_mata_uang: data.eq(0).text().trim(),
          kepanjangan_mata_uang: data.eq(1).text().trim()
        });
      }
    });

    $('#ctl00_PlaceHolderMain_g_6c89d4ad_107f_437d_bd54_8fda17b556bf_ctl00_GridView1 > table > tbody > tr').each((i, element) => {
      if (i < 25) {
        const data = $(element).find('td');
        const mata_uang = data.eq(0).text().trim();
        const matching_uang = uang.find(v => v.singkatan_mata_uang === mata_uang) || {};
        const nama_mata_uang = matching_uang.kepanjangan_mata_uang || '';

        result.push({
          mata_uang,
          nama_mata_uang,
          kurs_beli: data.eq(2).text().trim(),
          kurs_jual: data.eq(3).text().trim()
        });
      }
    });

    await fs.writeFile('../ekonomi/kurs.json', JSON.stringify(result, null, 2));
    console.log('Data kurs telah disimpan.');
  } catch (error) {
    console.error('Error fetching kurs data:', error);
  }
};

fetchKurs();
