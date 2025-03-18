// 저장 함수
export const saveData = (key: string, data: any, expireDate?: Date): void => {
    const expireAt = expireDate ? expireDate.getTime() : null;
    const storageData = {
      value: data,
      expireAt: expireAt,
    };
    localStorage.setItem(key, JSON.stringify(storageData));
  };
  
// 불러오기 함수 (만료 검사 포함)
export const loadData = (key: string): any | null => {
    const stored = localStorage.getItem(key);
    if (!stored) {
        localStorage.removeItem(key);
        return null;
    }
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const parsed = JSON.parse(stored);
      if (!parsed.expireAt || today.getTime() > parsed.expireAt) {
        localStorage.removeItem(key);  // 만료된 데이터 삭제
        return null;  // 데이터가 만료되었으므로 null 반환
      }
      return parsed.value;
    } catch (e) { 
      console.error('localStorage parse error:', e);
      localStorage.removeItem(key);
      return null;
      
    }
  };
  
  // 만료된 데이터 전체 청소
  export const cleanExpiredData = (): void => {
    Object.keys(localStorage).forEach((key) => {
      loadData(key); // 내부에서 만료된 거 삭제 처리
    });
  };
  
  // 삭제 함수 (원하는 key 삭제)
  export const removeData = (key: string): void => {
    localStorage.removeItem(key);
  };