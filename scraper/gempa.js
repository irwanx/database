const axios = require('axios');
const fs = require('fs').promises;

const fetchGempaTerkini = async () => {
  try {
    const { data } = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json');
    const gempaList = data.Infogempa.gempa;

    const result = gempaList.map(item => ({
      waktu: `${item.Tanggal} ${item.Jam}`,
      lintang: item.Lintang,
      bujur: item.Bujur,
      magnitudo: item.Magnitude,
      kedalaman: item.Kedalaman,
      wilayah: item.Wilayah,
    }));

    await fs.writeFile('./meteorologi-klimatologi-geofisika/gempa/gempa_terkini.json', JSON.stringify(result.slice(0, 30), null, 2));
    console.log('Data Gempa Terkini berhasil ditulis ke gempa_terkini.json');
  } catch (error) {
    console.error('Terjadi galat saat mengambil data gempa terkini:', error.message);
  }
};

const fetchGempaDirasakan = async () => {
  try {
    const { data } = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json');
    const gempaList = data.Infogempa.gempa;

    const result = gempaList.map(item => ({
      waktu: `${item.Tanggal} ${item.Jam}`,
      lintang: item.Lintang,
      bujur: item.Bujur,
      magnitudo: item.Magnitude,
      kedalaman: item.Kedalaman,
      dirasakan: item.Dirasakan,
    }));

    await fs.writeFile('./meteorologi-klimatologi-geofisika/gempa/gempa_dirasakan.json', JSON.stringify(result.slice(0, 20), null, 2));
    console.log('Data Gempa Dirasakan berhasil ditulis ke gempa_dirasakan.json');
  } catch (error) {
    console.error('Terjadi galat saat mengambil data gempa dirasakan:', error.message);
  }
};

(async () => {
  await fetchGempaTerkini();
  await fetchGempaDirasakan();
})();