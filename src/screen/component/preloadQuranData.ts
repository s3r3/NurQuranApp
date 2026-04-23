import { useQuranStore } from "../../store/useAppStore";
import axios from "axios";

export const preloadQuranData = async () => {
  const { isDataLoaded, setAllSurahs } = useQuranStore.getState();
  if (isDataLoaded) return; // Jangan download ulang jika sudah ada

  try {
    const res = await axios.get("https://equran.id/api/v2/surat");
    setAllSurahs(res.data.data);
  } catch (e) {
    console.error("Gagal memuat data pencarian", e);
  }
};