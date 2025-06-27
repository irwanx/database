const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;

const KURS_URL = 'https://www.bi.go.id/id/statistik/informasi-kurs/transaksi-bi/default.aspx';

const BROWSER_HEADER = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
};

const fetchKurs = async () => {
  try {
    console.log('Mengambil data kurs dari BI...');

    const { data } = await axios.get(KURS_URL, {
      headers: BROWSER_HEADER,
    });

    const $ = cheerio.load(data);
    const result = [];

    $('table.table > tbody > tr').each((i, element) => {
      const columns = $(element).find('td');
      if (columns.length > 0) {
        const kursData = {
          mata_uang: columns.eq(0).text().trim(),
          nilai: columns.eq(1).text().trim(),
          kurs_jual: columns.eq(2).text().trim(),
          kurs_beli: columns.eq(3).text().trim(),
        };
        result.push(kursData);
      }
    });

    if (result.length === 0) {
      console.warn('Tidak ada data yang berhasil diambil. Mungkin struktur tabel di situs BI telah berubah.');
      return;
    }

    await fs.writeFile('./ekonomi/kurs.json', JSON.stringify(result, null, 2));
    console.log('Data kurs BI berhasil ditulis ke kurs.json');

  } catch (error) {
    if (error.response) {
      console.error(`Error fetching kurs data: Server merespons dengan status ${error.response.status}`);
    } else if (error.code === 'ECONNRESET') {
      console.error('Error fetching kurs data: Koneksi direset oleh server. Coba lagi nanti atau periksa konfigurasi jaringan.');
    } else {
      console.error('Error fetching kurs data:', error.message);
    }
  }
};

fetchKurs();