const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;

const fetchGempaTerkini = async () => {
  try {
    const { data } = await axios.get('https://www.bmkg.go.id/gempabumi/gempabumi-terkini.bmkg');
    const $ = cheerio.load(data);
    const result = [];

    $('body > div.wrapper > div.container.content > div > div.col-md-8 > div > div > table > tbody > tr').each((i, element) => {
      if (i < 30) {
        const data = $(element).find('td');
        const gempa = {
          waktu: data.eq(1).text().trim(),
          lintang: data.eq(2).text().trim(),
          bujur: data.eq(3).text().trim(),
          magnitudo: data.eq(4).text().trim(),
          kedalaman: data.eq(5).text().trim(),
          wilayah: data.eq(6).text().trim()
        };
        result.push(gempa);
      }
    });

    await fs.writeFile('./meteorologi-klimatologi-geofisika/gempa/gempa_terkini.json', JSON.stringify(result, null, 2));
    console.log('Gempa terkini data has been written.');
  } catch (error) {
    console.error('Error fetching gempa terkini data:', error);
  }
};

const fetchGempaDirasakan = async () => {
  try {
    const { data } = await axios.get('https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg');
    const $ = cheerio.load(data);
    const result = [];

    $('body > div.wrapper > div.container.content > div > div.col-md-8 > div > div > table > tbody > tr').each((i, element) => {
      if (i < 20) {
        const data = $(element).find('td');
        const warnings = [];
        const warningElements = data.eq(5).find('span.label-warning');
        warningElements.each((j, warnElement) => {
          warnings.push($(warnElement).text().replace('\t', ' ').trim());
        });

        const gempa = {
          waktu: data.eq(1).html().replace(/<br>/g, ' ').trim(),
          lintang: data.eq(2).text().split(' ').slice(0, 2).join(' ').trim(),
          bujur: data.eq(2).text().split(' ').slice(2, 4).join(' ').trim(),
          magnitudo: data.eq(3).text().trim(),
          kedalaman: data.eq(4).text().trim(),
          wilayah: data.eq(5).find('a').text().trim(),
          warning: warnings
        };
        result.push(gempa);
      }
    });

    await fs.writeFile('./meteorologi-klimatologi-geofisika/gempa/gempa_dirasakan.json', JSON.stringify(result, null, 2));
    console.log('Gempa dirasakan data has been written.');
  } catch (error) {
    console.error('Error fetching gempa dirasakan data:', error);
  }
};

(async () => {
  await fetchGempaTerkini();
  await fetchGempaDirasakan();
})();
