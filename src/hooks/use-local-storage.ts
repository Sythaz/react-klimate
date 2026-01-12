import { useEffect, useState } from "react";

/**
 * Custom hook untuk menyimpan data di localStorage browser secara persistent
 *
 * Seperti SharedPreferences di Flutter, tapi built-in di browser tanpa perlu package
 * Data akan tetap ada meskipun browser di-refresh atau ditutup
 *
 * @template T - Type data yang akan disimpan (string, number, object, array, dll) [Enaknya dibilagn tipe data generik]
 * @param key - Nama key untuk menyimpan data di localStorage
 * @param initialValue - Nilai default jika belum ada data tersimpan
 * @returns Array [storedValue, setStoredValue] seperti useState
 *
 * @example
 * // Simple string
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 *
 * @example
 * // Array of objects
 * const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
 *
 * @example
 * // Complex object
 * const [user, setUser] = useLocalStorage<User>('user', { name: 'Guest' });
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State dengan lazy initialization (arrow function)
  // Function ini HANYA jalan SEKALI saat component mount (bukan setiap render)
  // Ini penting untuk performa karena akses localStorage relatif lambat
  const [storedValue, setStoredValue] = useState<T>(() => {
    // try-catch untuk handle error:
    // - Browser private mode (localStorage disabled)
    // - Storage penuh (QuotaExceededError)
    // - Data corrupt/invalid JSON
    try {
      // Ambil data dari localStorage berdasarkan key
      // Return: string | null (string jika ada, null jika kosong)
      const item = window.localStorage.getItem(key);

      // Ternary operator: kondisi ? true : false
      // Jika item ada → parse dari JSON string ke original type
      // Jika item null → gunakan initialValue
      // localStorage hanya bisa simpan string, jadi kita parse JSON untuk restore original type
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Log error untuk debugging tapi tidak throw (silent fail)
      console.error(error);
      // Fallback ke initialValue agar app tidak crash
      return initialValue;
    }
  });

  // useEffect untuk auto-save ke localStorage setiap kali data berubah
  // Dependency array [key, storedValue] memastikan effect jalan saat salah satu berubah
  useEffect(() => {
    try {
      // Simpan data ke localStorage
      // JSON.stringify convert semua type (object, array, etc) jadi string
      // karena localStorage hanya bisa simpan string
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      // Silent fail jika storage penuh atau error lainnya
      console.error(error);
    }
  }, [key, storedValue]); // Re-run effect saat key atau storedValue berubah

  // Return array [value, setter] seperti useState
  // 'as const' untuk type safety: TypeScript tahu posisi exact [T, Setter]
  // Tanpa 'as const', type jadi array biasa yang kurang specific
  return [storedValue, setStoredValue] as const;
}
