const TYPE_COLLECTIONS = [
  { ISTJ:{type:'ISTJ',subtitle:'청렴결백한 논리주의자'}, ISFJ:{type:'ISFJ',subtitle:'따뜻한 수호자'}, INFJ:{type:'INFJ',subtitle:'선의의 옹호자'}, INTJ:{type:'INTJ',subtitle:'용의주도한 전략가'}, ISTP:{type:'ISTP',subtitle:'만능 재주꾼'}, ISFP:{type:'ISFP',subtitle:'호기심 많은 예술가'}, INFP:{type:'INFP',subtitle:'열정적인 중재자'}, INTP:{type:'INTP',subtitle:'논리적인 사색가'}, ESTP:{type:'ESTP',subtitle:'모험을 즐기는 사업가'}, ESFP:{type:'ESFP',subtitle:'자유로운 영혼의 연예인'}, ENFP:{type:'ENFP',subtitle:'재기발랄한 활동가'}, ENTP:{type:'ENTP',subtitle:'뜨거운 논쟁을 즐기는 변론가'}, ESTJ:{type:'ESTJ',subtitle:'엄격한 관리자'}, ESFJ:{type:'ESFJ',subtitle:'사교적인 외교관'}, ENFJ:{type:'ENFJ',subtitle:'정의로운 사회운동가'}, ENTJ:{type:'ENTJ',subtitle:'대담한 통솔자'} },
  { pure_teto:{type:'순수 테토형',subtitle:'추진력의 화신'}, teto_mix:{type:'테토 우세 혼합형',subtitle:'균형 잡힌 추진력'}, gegen_mix:{type:'에겐 우세 혼합형',subtitle:'섬세한 공감형'}, pure_gegen:{type:'순수 에겐형',subtitle:'섬세함의 달인'} },
  { red:{type:'레드 오라',subtitle:'정열과 에너지의 화신'}, blue:{type:'블루 오라',subtitle:'지성과 신뢰의 상징'}, green:{type:'그린 오라',subtitle:'치유와 균형의 에너지'}, gold:{type:'골드 오라',subtitle:'창의성과 카리스마의 빛'}, purple:{type:'퍼플 오라',subtitle:'신비와 직관의 힘'} },
  { passionate:{type:'열정 몰입형',subtitle:'사랑할 땐 올인!'}, secure:{type:'안정 신뢰형',subtitle:'든든하고 건강한 연애'}, independent:{type:'쿨한 독립형',subtitle:'나도 중요해, 너도 중요해'}, romantic:{type:'순수 로맨티스트',subtitle:'사랑 자체가 설레는 사람'} },
  { high:{type:'고감도 HSP형',subtitle:'세상을 깊이 느끼는 사람'}, mid:{type:'중간 감도형',subtitle:'감성과 이성의 균형자'}, low:{type:'저감도 강인형',subtitle:'웬만한 건 거뜬한 멘탈 갑'} },
  { workaholic:{type:'열정 워커홀릭형',subtitle:'일이 곧 나다!'}, balance:{type:'워라밸 수호자형',subtitle:'일도 삶도 다 잡는다'}, liberalist:{type:'자유 영혼 직장인형',subtitle:'내 시간이 제일 소중해'}, political:{type:'사내 처세술형',subtitle:'관계가 경쟁력이다'} },
  { rest:{type:'완전 휴식형',subtitle:'아무것도 안 하는 게 최고의 힐링'}, social:{type:'사람 충전형',subtitle:'사람이 나의 에너지원!'}, active:{type:'액티브 활동형',subtitle:'몸을 움직여야 풀린다!'}, sensory:{type:'감각 충전형',subtitle:'오감으로 즐기는 힐링'}, escape:{type:'일탈 탈출형',subtitle:'새로운 곳에서 리셋!'} },
  { ironmental:{type:'철벽 멘탈형',subtitle:'어지간한 건 다 씹어먹는다'}, hidden:{type:'속앓이 참을인형',subtitle:'밖에선 웃고 안에서 삭힌다'}, honest:{type:'직언 솔직형',subtitle:'할 말은 하고 살아야 직성이 풀린다'}, burnout:{type:'번아웃 위험형',subtitle:'지금 당장 쉬어야 해요'} },
];
   
const BOT_UA = ["kakaotalk","facebookexternalhit","twitterbot","slackbot","linkedinbot","discordbot","telegrambot","whatsapp","googlebot","bingbot","yeti","naverbot","daumoa","applebot","iframely","opengraph"];
 
export async function onRequest(context) {
  const request = context.request;
  const ua = (request.headers.get("user-agent") || "").toLowerCase();
  const isBot = BOT_UA.some(b => ua.includes(b));
 
  if (!isBot) return context.next();
 
  const url = new URL(request.url);
  const t = url.searchParams.get("t");
  const r = url.searchParams.get("r");
 
  if (t === null || r === null) return context.next();
 
  const tIdx = parseInt(t);
  if (isNaN(tIdx) || tIdx < 0 || tIdx >= TYPE_COLLECTIONS.length) return context.next();
 
  const result = TYPE_COLLECTIONS[tIdx][r];
  if (!result) return context.next();
 
  const ogTitle = `나는 "${result.type}" | 마이타입`;
  const ogDesc = `${result.subtitle} - 나도 테스트해보기!`;
  const ogImage = `https://mytypes.co.kr/og-image-v2.png`;
 
  return new Response(`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>${ogTitle}</title>
<meta property="og:type" content="website">
<meta property="og:url" content="${url.toString()}">
<meta property="og:title" content="${ogTitle}">
<meta property="og:description" content="${ogDesc}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="800">
<meta property="og:image:height" content="400">
<meta property="og:site_name" content="마이타입 - 나를 알아가는 심리테스트">
<meta property="og:locale" content="ko_KR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${ogTitle}">
<meta name="twitter:description" content="${ogDesc}">
<meta name="twitter:image" content="${ogImage}">
</head>
<body><script>window.location.replace("${url.toString()}");</script></body>
</html>`, {
    status: 200,
    headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "public,max-age=3600" }
  });
}
 
