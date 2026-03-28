// Netlify Edge Function — OG 태그 동적 주입 (7개 테스트 버전)
const TYPE_COLLECTIONS = [
  { // 0: MBTI
    ISTJ:{emoji:'🏛️',type:'ISTJ',subtitle:'청렴결백한 논리주의자'},
    ISFJ:{emoji:'🌸',type:'ISFJ',subtitle:'따뜻한 수호자'},
    INFJ:{emoji:'🔮',type:'INFJ',subtitle:'선의의 옹호자'},
    INTJ:{emoji:'♟️',type:'INTJ',subtitle:'용의주도한 전략가'},
    ISTP:{emoji:'🔧',type:'ISTP',subtitle:'만능 재주꾼'},
    ISFP:{emoji:'🎨',type:'ISFP',subtitle:'호기심 많은 예술가'},
    INFP:{emoji:'🦋',type:'INFP',subtitle:'열정적인 중재자'},
    INTP:{emoji:'💡',type:'INTP',subtitle:'논리적인 사색가'},
    ESTP:{emoji:'🔥',type:'ESTP',subtitle:'모험을 즐기는 사업가'},
    ESFP:{emoji:'🎭',type:'ESFP',subtitle:'자유로운 영혼의 연예인'},
    ENFP:{emoji:'🌟',type:'ENFP',subtitle:'재기발랄한 활동가'},
    ENTP:{emoji:'⚡',type:'ENTP',subtitle:'뜨거운 논쟁을 즐기는 변론가'},
    ESTJ:{emoji:'👑',type:'ESTJ',subtitle:'엄격한 관리자'},
    ESFJ:{emoji:'💝',type:'ESFJ',subtitle:'사교적인 외교관'},
    ENFJ:{emoji:'🌍',type:'ENFJ',subtitle:'정의로운 사회운동가'},
    ENTJ:{emoji:'⚔️',type:'ENTJ',subtitle:'대담한 통솔자'},
  },
  { // 1: 테토에겐
    pure_teto:{emoji:'🔥',type:'순수 테토형',subtitle:'추진력의 화신'},
    teto_mix:{emoji:'⚡',type:'테토 우세 혼합형',subtitle:'균형 잡힌 추진력'},
    gegen_mix:{emoji:'🌙',type:'에겐 우세 혼합형',subtitle:'섬세한 공감형'},
    pure_gegen:{emoji:'✨',type:'순수 에겐형',subtitle:'섬세함의 달인'},
  },
  { // 2: 오라
    red:{emoji:'🔴',type:'레드 오라',subtitle:'정열과 에너지의 화신'},
    blue:{emoji:'🔵',type:'블루 오라',subtitle:'지성과 신뢰의 상징'},
    green:{emoji:'💚',type:'그린 오라',subtitle:'치유와 균형의 에너지'},
    gold:{emoji:'🌟',type:'골드 오라',subtitle:'창의성과 카리스마의 빛'},
    purple:{emoji:'💜',type:'퍼플 오라',subtitle:'신비와 직관의 힘'},
  },
  { // 3: 연애
    passionate:{emoji:'🔥',type:'열정 몰입형',subtitle:'사랑할 땐 올인!'},
    secure:{emoji:'🤝',type:'안정 신뢰형',subtitle:'든든하고 건강한 연애'},
    independent:{emoji:'🦅',type:'쿨한 독립형',subtitle:'나도 중요해, 너도 중요해'},
    romantic:{emoji:'🌹',type:'순수 로맨티스트',subtitle:'사랑 자체가 설레는 사람'},
  },
  { // 4: HSP
    high:{emoji:'🌙',type:'고감도 HSP형',subtitle:'세상을 깊이 느끼는 사람'},
    mid:{emoji:'🌤️',type:'중간 감도형',subtitle:'감성과 이성의 균형자'},
    low:{emoji:'☀️',type:'저감도 강인형',subtitle:'웬만한 건 거뜬한 멘탈 갑'},
  },
  { // 5: 직장인
    workaholic:{emoji:'💪',type:'열정 워커홀릭형',subtitle:'일이 곧 나다!'},
    balance:{emoji:'⚖️',type:'워라밸 수호자형',subtitle:'일도 삶도 다 잡는다'},
    liberalist:{emoji:'🦋',type:'자유 영혼 직장인형',subtitle:'내 시간이 제일 소중해'},
    political:{emoji:'🎭',type:'사내 처세술형',subtitle:'관계가 경쟁력이다'},
  },
  { // 6: 힐링
    rest:{emoji:'🛌',type:'완전 휴식형',subtitle:'아무것도 안 하는 게 최고의 힐링'},
    social:{emoji:'🥂',type:'사람 충전형',subtitle:'사람이 나의 에너지원!'},
    active:{emoji:'🏃',type:'액티브 활동형',subtitle:'몸을 움직여야 풀린다!'},
    sensory:{emoji:'🍽️',type:'감각 충전형',subtitle:'오감으로 즐기는 힐링'},
    escape:{emoji:'✈️',type:'일탈 탈출형',subtitle:'새로운 곳에서 리셋!'},
  },
];

const BOT_UA = [
  "kakaotalk","facebookexternalhit","twitterbot","slackbot",
  "linkedinbot","discordbot","telegrambot","whatsapp",
  "googlebot","bingbot","yeti","naverbot","daumoa",
  "applebot","iframely","opengraph"
];

function isBot(ua) {
  if(!ua) return false;
  const u = ua.toLowerCase();
  return BOT_UA.some(b => u.includes(b));
}

export default async function handler(request, context) {
  const ua = request.headers.get("user-agent") || "";
  if(!isBot(ua)) return context.next();

  const url = new URL(request.url);
  const t = url.searchParams.get("t");
  const r = url.searchParams.get("r");

  if(t === null || r === null) return context.next();

  const tIdx = parseInt(t);
  if(isNaN(tIdx) || tIdx < 0 || tIdx >= TYPE_COLLECTIONS.length) return context.next();

  const tc = TYPE_COLLECTIONS[tIdx];
  const result = tc[r];
  if(!result) return context.next();

  const ogTitle = `${result.emoji} 나는 "${result.type}"`;
  const ogDesc = `${result.subtitle} — 나도 테스트해보기!`;
  const pageUrl = url.toString();
  const ogImage = `${url.origin}/og-image.png`;

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${ogTitle} | 마이타입</title>
<meta property="og:type" content="website">
<meta property="og:url" content="${pageUrl}">
<meta property="og:title" content="${ogTitle}">
<meta property="og:description" content="${ogDesc}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="800">
<meta property="og:image:height" content="400">
<meta property="og:site_name" content="마이타입 — 나를 알아가는 심리테스트">
<meta property="og:locale" content="ko_KR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${ogTitle}">
<meta name="twitter:description" content="${ogDesc}">
<meta name="twitter:image" content="${ogImage}">
</head>
<body>
<p>잠시 후 이동합니다...</p>
<script>window.location.replace("${pageUrl}");</script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export const config = { path: "/*" };
