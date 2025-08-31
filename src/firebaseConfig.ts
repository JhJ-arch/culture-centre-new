// [매우 중요 보안 경고]
// 이 파일에는 민감한 API 키가 포함되어 있습니다. 이 코드는 절대로
// 공개된 GitHub 저장소에 올리면 안 됩니다. 악의적인 사용자가
// 이 키를 사용하여 당신의 데이터베이스에 접근하고 데이터를 변경하거나
// 과도한 요금을 발생시킬 수 있습니다.
//
// 앱 기능이 정상적으로 동작하는 것을 확인한 후에는, 이전에 안내해 드린
// Vercel 환경 변수를 사용하는 방식으로 즉시 전환하는 것을 강력히 권장합니다.

const firebaseConfig = {
  apiKey: "AIzaSyAZfD7Km0ZAW7uoJf_v84M1xKeafRB1izc",
  authDomain: "culturecentre-3cbf2.firebaseapp.com",
  // Realtime Database를 사용하기 위해 databaseURL을 명시적으로 추가합니다.
  databaseURL: "https://culturecentre-3cbf2-default-rtdb.firebaseio.com",
  projectId: "culturecentre-3cbf2",
  storageBucket: "culturecentre-3cbf2.firebasestorage.app",
  messagingSenderId: "1013628629820",
  appId: "1:1013628629820:web:c1058c2015192acd2ea439",
  measurementId: "G-MCECBR5RRH"
};

export default firebaseConfig;
