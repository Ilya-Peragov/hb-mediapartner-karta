/* Макет карточки медиапартнёра на ките. Одна карточка, два взгляда (админка и кабинет партнёра) и список партнёров.
   Путь: линейный «Запуск», параллельные дорожки «Работа», финальное «Закрытие». «Что сделать сейчас» - очередь задач роли.
   Классы и разметка - кит (css/*.css), своё только в novoe.css. Подсказки [data-tip], тосты hbToast и окна dialog.modal даёт кит (js/hb-ui.js). */
(function () {
'use strict';
const NB = ' ';
const usd = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, NB) + NB + '$';
const usd2 = n => usd(n).replace(NB + '$', ',00' + NB + '$');
const nf = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, NB);
const num = s => { const n = Number(String(s).replace(/[\s $]/g, '').replace(',', '.')); return isFinite(n) ? n : NaN; };
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const val = x => (typeof x === 'function' ? x() : x);
const ic = (n, c) => '<svg class="ic' + (c ? ' ' + c : '') + '" aria-hidden="true"><use href="#i-' + n + '"/></svg>';
const plural = (n, a, b, c) => { const m = Math.abs(n) % 100, k = m % 10; return m > 10 && m < 20 ? c : k === 1 ? a : k >= 2 && k <= 4 ? b : c; };

/* ---------- Роли, рынки ---------- */
const ROLES = {
  dept: { name: 'Партнёрский отдел', who: 'Мария', money: false },
  mkt: { name: 'Маркетинг', who: 'Олег', money: false },
  fin: { name: 'Финансист', who: 'Анна', money: true },
  cfo: { name: 'Финансовый директор', who: 'Дмитрий', money: true },
  admin: { name: 'Администратор', who: 'Администратор', money: true }
};
const RN = { dept: 'партнёрский отдел', mkt: 'маркетинг', fin: 'финансист', cfo: 'финансовый директор', admin: 'администратор', partner: 'партнёр' };
/* Роль в таблицах и бейджах: подписи как в живом коде (ROLE_LABEL) */
const RNT = { dept: 'Партнёрский отдел', mkt: 'Маркетинг', fin: 'Финансист', cfo: 'Финансовый директор', admin: 'Администратор', partner: 'Партнёр' };
const MK = {
  dubai: { name: 'Дубай', terr: ['ОАЭ (AE)'] },
  thailand: { name: 'Таиланд', terr: ['Таиланд (TH)'] },
  trust: { name: 'Доверяю Housebook', terr: ['ОАЭ (AE)', 'Таиланд (TH)'] }
};
/* Контекст «чей партнёр»: в списке данные считаются по каждому партнёру, поэтому текущего партнёра можно подменить (pid). list - единый момент «сегодня» для всех строк списка. */
const CTX = { pid: null, list: null };
const ctxPid = () => CTX.pid || st.pid;
/* Свои номера у каждого партнёра: заказ, клиенты, метка кампании. t и m - обращения с меткой и заявки Meta на 1 500 $ расхода. */
const PD = {
  mpa: { order: 'fdyEqNCk8t8RNr4aBg45', old: 'Tv9V5H', c5: 'HB-C5R8WE', k4: 'HB-K41T9P', dp: 'HB-7QM2LD', dl: 'HB-AN0ZHN', t: 23, m: 41 },
  gulf: { order: 'Qm3xT7pLw2VnZ9cKd1Hs', old: 'Lp2Xz8', c5: 'HB-G2L7XD', k4: 'HB-G8M3QA', dp: 'HB-G5V1ZN', dl: 'HB-G9T4KC', t: 19, m: 33 },
  palm: { order: 'Wz6RbH2yNe4PaJc7UuTk', old: 'Hd4Nq1', c5: 'HB-P3D8WY', k4: 'HB-P7Q2LE', dp: 'HB-P1X9RM', dl: 'HB-P6B5TV', t: 21, m: 36 },
  aur: { order: 'Ht8KvD3jLs9XcM1oPyQe', old: 'Zc7Rw2', c5: 'HB-A4F6NS', k4: 'HB-A9H2UB', dp: 'HB-A3J7KT', dl: 'HB-A8E1GD', t: 17, m: 29 },
  nom: { order: 'Xb1PnC5vTq7LgR8wEaYd', old: 'Qs3Vk9', c5: 'HB-N5Y3CP', k4: 'HB-N2Z8HF', dp: 'HB-N6W4BX', dl: 'HB-N1R9MJ', t: 25, m: 40 },
  dune: { order: 'Ye9SmF4kBw2ZhN6tDjUa', old: 'Gp5Tm8', c5: 'HB-D7K2VQ', k4: 'HB-D3S6AL', dp: 'HB-D8N1EZ', dl: 'HB-D4C9RW', t: 22, m: 34 },
  sun: { order: 'Rc2LzJ7nQy5VwA9hXdKp', old: 'Bn6Yx1', c5: 'HB-S9P4TG', k4: 'HB-S1U7MD', dp: 'HB-S5F3JK', dl: 'HB-S2V8QH', t: 15, m: 26 },
  oce: { order: 'Ka4TwB8uHf3NzE6mCqXs', old: 'Vj9Dr5', c5: 'HB-O6M1YB', k4: 'HB-O2G8CK', dp: 'HB-O7H5XP', dl: 'HB-O3L9ZT', t: 18, m: 27 }
};
const pd = () => PD[ctxPid()] || PD.mpa;
const orderId = () => pd().order;
const sfx = () => orderId().slice(-6);
const tag = () => 'mp-' + orderId();
const campShort = () => 'mp-…' + sfx();
const link = () => 'https://housebook.global/dubai?utm_source=meta&utm_campaign=' + tag();
const rn = o => RN[o];
const ownerTxt = o => ROLES[o].who + ' (' + RN[o] + ')';

/* ---------- Время по Дубаю. Правила по договору HB-MP v2.1 и по коду src/lib/media-partner/money/timing.ts:
   рабочий день пн-пт (праздничный календарь Дубая в макете не учитывается: в коде он параметр, в макет не подставлен);
   остановка расходов (п. 5.3): требование после 18:00 считается полученным в 09:00 следующего рабочего дня, срок отключения +1 рабочий день;
   выплата (п. 6.4): 15 рабочих дней, до конца дня; возврат остатка (п. 5.6): 10 рабочих дней, до конца дня; окно отказа (п. 5.1): ровно 24 часа. ---------- */
const DAY = 86400000;
const pad2 = n => String(n).padStart(2, '0');
const fmtD = d => pad2(d.getDate()) + '.' + pad2(d.getMonth() + 1) + '.' + d.getFullYear();
const fmtDT = d => fmtD(d) + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());
const dt = ms => fmtDT(new Date(ms));
const dShort = ms => { const d = new Date(ms); return pad2(d.getDate()) + '.' + pad2(d.getMonth() + 1); };
const dtShort = ms => dShort(ms) + ', ' + pad2(new Date(ms).getHours()) + ':' + pad2(new Date(ms).getMinutes());
const parseNow = s => new Date(+s.slice(6, 10), +s.slice(3, 5) - 1, +s.slice(0, 2), +s.slice(11, 13), +s.slice(14, 16)).getTime();
const isWork = d => d.getDay() >= 1 && d.getDay() <= 5;
function addBD(ms, n) { const d = new Date(ms); let k = 0; while (k < n) { d.setDate(d.getDate() + 1); if (isWork(d)) k++; } return d.getTime(); }
function endBD(ms, n) { const d = new Date(addBD(ms, n)); d.setHours(23, 59, 59, 999); return d.getTime(); }
function stopTerms(ms) {
  const d = new Date(ms), req = d.getTime(), late = d.getHours() * 60 + d.getMinutes() > 18 * 60;
  let recv = req;
  if (late) { const r = new Date(ms); do { r.setDate(r.getDate() + 1); } while (!isWork(r)); r.setHours(9, 0, 0, 0); recv = r.getTime(); }
  return { req: req, recv: recv, due: addBD(recv, 1) };
}
const fmtLeft = left => Math.floor(left / 3600) + ' ч ' + pad2(Math.floor(left % 3600 / 60)) + ' мин ' + pad2(left % 60) + ' с';
/* Сколько осталось, словами: дни, часы и минуты. ms до срока; отрицательное - просрочено. */
function remTxt(ms) {
  const a = Math.abs(ms), d = Math.floor(a / DAY), h = Math.floor(a % DAY / 3600000), m = Math.floor(a % 3600000 / 60000);
  const body = d >= 2 ? d + ' ' + plural(d, 'день', 'дня', 'дней') : d === 1 ? '1 день ' + h + ' ч' : h >= 1 ? h + ' ч ' + pad2(m) + ' мин' : m + ' мин';
  return (ms < 0 ? 'просрочено на ' : 'осталось ') + body;
}
/* Цвет срока: обычный, жёлтый когда осталось меньше 20% срока, красный когда просрочено. */
const dueKind = (rem, span) => (rem < 0 ? 'err' : rem < 0.2 * span ? 'warn' : 'muted');

/* ---------- Состояние: снимок одного партнёра (SNAP) + общее для экрана ---------- */
/* Реквизиты Housebook для оплаты (раздел «Реквизиты для оплаты»): значений по умолчанию в коде нет, в макете условный пример. Общие для всех партнёров, поэтому не в снимке. */
const HBREQ0 = () => ({ name: 'Housebook, юрлицо из настроек (пример)', bank: 'Банк в Дубае (пример)', addr: 'Дубай, ОАЭ (пример)', iban: 'AE00 0000 0000 0000 0000 000', swift: 'XXXXAEAA', purpose: 'HB-MP v2.1, счёт {invoice}' });
const REQ_FIELDS = ['name', 'bank', 'addr', 'iban', 'swift', 'purpose'];
const REQ_LABEL = { name: 'Получатель', bank: 'Банк', addr: 'Адрес банка', iban: 'Номер счёта или IBAN', swift: 'SWIFT/BIC', purpose: 'Назначение платежа (шаблон)' };
const REQLOG0 = () => [{ t: '12.10.2026 09:40', who: 'Дмитрий (финансовый директор)', d: REQ_FIELDS.map(k => ({ k: k, was: '', now: HBREQ0()[k] })) }];
const SNAP = ['f', 'adj', 'orderBy', 'did', 'stops', 'halt', 'haltBy', 'haltWhy', 'market', 'budget', 'spent', 'refund', 'manual', 'bank', 'reward', 'excp', 'excpDone', 'cancelled', 'remarks', 'mkNext', 'payer', 'payee', 'fbPart', 'nodsp'];
const snapDef = () => ({ f: 0, adj: 0, orderBy: 'partner', did: {}, stops: [], halt: null, haltBy: '', haltWhy: '', market: 'dubai', budget: 2000, spent: 1500, refund: 0, manual: false, bank: '', reward: 3000, excp: false, excpDone: false, cancelled: false, remarks: false, mkNext: '', payer: 'legal_entity', payee: null, fbPart: 0, nodsp: false });
const st = Object.assign({ role: 'dept', mode: 'admin', pid: 'mpa', conn: 'arrow', rail: false, demoOpen: false, logF: { who: '', type: '', from: '', to: '' }, secOpen: {}, mkPick: '', lq: '', ls: '', store: {}, hbreq: HBREQ0(), reqLog: REQLOG0(), alert: '', pauseFail: false }, snapDef());
const reserveOf = () => Math.min(st.budget * 0.1, 500);
const restOf = () => st.budget - st.spent - reserveOf() + st.refund;
const novSpent = () => Math.round(st.budget * 0.55);
const orderName = () => MK[st.market].name + ', ' + usd(st.budget) + ' в месяц';
function takeSnap() { const o = {}; SNAP.forEach(k => { o[k] = st[k]; }); return JSON.parse(JSON.stringify(o)); }
function putSnap(o) { Object.assign(st, snapDef(), JSON.parse(JSON.stringify(o))); }
function withSnap(sn, fn) { const keep = takeSnap(); putSnap(sn); try { return fn(); } finally { putSnap(keep); } }

/* Общее состояние на оба режима: адрес (кадр, роль, режим, партнёр) и память вкладки (всё остальное) */
const SKEY = 'hb-mp-ux3-state-v2';
function saveSt() { try { const o = { cur: takeSnap(), role: st.role, mode: st.mode, pid: st.pid, conn: st.conn, rail: st.rail, demoOpen: st.demoOpen, store: st.store, hbreq: st.hbreq, reqLog: st.reqLog, alert: st.alert, pauseFail: st.pauseFail }; sessionStorage.setItem(SKEY, JSON.stringify(o)); } catch (e) { /* память вкладки закрыта: состояние живёт до перезагрузки */ } }
function loadSt() { try { const j = JSON.parse(sessionStorage.getItem(SKEY) || 'null'); if (j) { putSnap(j.cur); ['role', 'mode', 'pid', 'conn', 'rail', 'demoOpen', 'store', 'hbreq', 'reqLog', 'alert', 'pauseFail'].forEach(k => { if (j[k] !== undefined) st[k] = j[k]; }); } } catch (e) { /* пусто или битое: начинаем с нуля */ } }

/* ---------- Мелкие кирпичи на классах кита ---------- */
const B = (kind, txt, tip) => '<span class="badge badge--' + kind + ' badge--txt" tabindex="0"' + (tip ? ' data-tip="' + esc(tip) + '"' : '') + '>' + txt + '</span>';
const NEW = tip => B('start', 'новое', tip);
const field = (id, label, ctl, hint, err) => '<div class="field"><label for="' + id + '">' + label + '</label>' + ctl + (hint ? '<p class="field__hint">' + hint + '</p>' : '') + (err ? errBox(err) : '') + '</div>';
const errBox = id => '<div class="notice notice--err" id="' + id + '" role="alert" hidden>' + ic('circle-alert') + '<p class="notice__t"></p></div>';
const resBox = id => '<div class="notice" id="' + id + '" role="status">' + ic('equal') + '<p class="notice__t"></p></div>';
const facts = items => '<dl class="facts">' + items.map(i => '<div><dt>' + i[0] + '</dt><dd>' + i[1] + '</dd></div>').join('') + '</dl>';
const kv = items => '<dl class="kv">' + items.map(i => '<div><dt>' + i[0] + '</dt><dd>' + i[1] + '</dd></div>').join('') + '</dl>';
const checks = items => '<ul class="stack">' + items.map(i => '<li>' + ic('check', 'ic--16') + ' ' + i + '</li>').join('') + '</ul>';
const pill = (t, tip) => '<span class="pill"' + (tip ? ' tabindex="0" data-tip="' + esc(tip) + '"' : '') + '>' + t + '</span>';
const tbl = (head, rows, cls) => '<div class="tbl tbl--stack' + (cls ? ' ' + cls : '') + '"><table><thead><tr>' + head.map(h => '<th scope="col"' + (h[1] ? ' class="num"' : '') + '>' + h[0] + '</th>').join('') + '</tr></thead><tbody>' + rows.map(r => '<tr' + (r.attr ? ' ' + r.attr : '') + '>' + (r.cells || r).map((c, i) => '<td data-label="' + esc(head[i][0]) + '"' + (head[i][1] ? ' class="num"' : '') + '>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
const empty = t => '<div class="empty"><p class="empty__t">' + t + '</p></div>';
/* Секция карточки админки: раскрывающаяся (как в живом коде), открытое состояние помним между перерисовками */
const secWrap = (id, title, body, open) => '<details class="disclose" id="mp-sec-' + id + '" data-sec="' + id + '"' + (open || st.secOpen[id] ? ' open' : '') + '><summary>' + title + ' ' + ic('chevron-down') + '</summary><div class="stack stack--l">' + body + '</div></details>';
const sec = (id, title, why, body) => secWrap(id, title, '<p class="note">Зачем: ' + why + '</p>' + body);
const panel = body => '<div class="panel stack">' + body + '</div>';

/* ---------- Сроки: единый способ показать срок задачи и сколько осталось ---------- */
const NODUE = 'Срок для этого шага пока не установлен.';
const OWN = 'Срок утверждён владельцем 27.10.2026. ';
const endDay = ms => { const d = new Date(ms); d.setHours(23, 59, 59, 999); return d.getTime(); };
/* Срок от момента from: n рабочих дней (праздничный календарь ОАЭ в макете не подставлен: в коде он параметр) */
const dueBD = (from, n, rule) => { const due = addBD(from, n); return { due: due, span: due - from, rule: OWN + rule }; };
const dueDay = (from, rule) => { const due = endDay(from); return { due: due, span: due - from, rule: OWN + rule }; };
/* В списке у всех строк одно «сегодня» (CTX.list): дата срока строится от него, так «до» и «осталось» согласованы между партнёрами. */
const shiftT = (ms, now) => (CTX.list === null ? ms : CTX.list + (ms - now));
/* dueChip: d = {due, span, rule} от задачи, now - часы сценария. Текст «осталось» живой: его обновляет tick() от тех же часов, что и таймер тревоги. */
function dueChip(d, now) {
  if (!d) return B('muted', 'срок не задан', NODUE);
  const rem = d.due - now, kind = dueKind(rem, d.span), dd = shiftT(d.due, now), n0 = CTX.list === null ? now : CTX.list;
  const tip = (d.rule || '') + '\nСрок: ' + dt(dd) + ' (Дубай)' + (kind === 'warn' ? '\nОсталось меньше 20% срока' : kind === 'err' ? '\nСрок прошёл' : '');
  const pre = 'до ' + dtShort(dd) + ', ';
  return '<span class="badge badge--' + kind + ' badge--txt" tabindex="0" data-tip="' + esc(tip) + '" data-due="' + dd + '" data-n0="' + n0 + '" data-pre="' + esc(pre) + '">' + pre + remTxt(rem) + '</span>';
}

/* ---------- Метрики Meta по заказу (реалистичные цифры для 1 500 $ в Дубае, остальное пересчитывается) ---------- */
const DAYS = ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
const SPEND_D = [60, 110, 125, 130, 140, 135, 120, 130, 145, 150, 135, 120];
const CLICK_D = [90, 170, 195, 205, 225, 210, 185, 200, 230, 240, 210, 180];
const AD_SHARE = [
  { n: 'Dubai Marina, 2-комнатные: карусель', sp: 540, im: 64800, cl: 860, ld: 16 },
  { n: 'Палм Джумейра, видео 15 сек', sp: 420, im: 50400, cl: 620, ld: 11 },
  { n: 'Рассрочка 5 лет, статичный баннер', sp: 330, im: 39600, cl: 520, ld: 9 },
  { n: 'Business Bay для инвестора, карусель', sp: 210, im: 25200, cl: 340, ld: 5 }
];
const taggedN = () => Math.round(pd().t * st.spent / 1500), metaN = () => Math.round(pd().m * st.spent / 1500);
function meta() {
  const k = st.spent / 1500;
  const impr = Math.round(180000 * k), clicks = Math.round(2340 * k), inq = Math.max(1, taggedN());
  const rows = AD_SHARE.map(a => ({ n: a.n, sp: Math.round(a.sp * k), im: Math.round(a.im * k), cl: Math.round(a.cl * k), ld: Math.round(a.ld * k) }));
  return { impr, reach: Math.round(95000 * k), freq: '1,9', clicks, ctr: (clicks / impr * 100).toFixed(1).replace('.', ','), cpc: (st.spent / clicks).toFixed(2).replace('.', ','), cpm: (st.spent / impr * 1000).toFixed(1).replace('.', ','),
    leads: metaN(), inq, cpi: (st.spent / inq).toFixed(0), rows, sd: SPEND_D.map(v => Math.round(v * k)), cd: CLICK_D.map(v => Math.round(v * k)) };
}

/* ---------- Кадры: каждый кадр = один момент сценария. У кадра задачи ролей (tasks): они открыты, пока кадр текущий,
   а задача с until остаётся открытой и в следующих кадрах до кадра until (параллельные дорожки). ---------- */
const F = [], ix = {};
const fr = o => { ix[o.id] = F.length; F.push(o); (o.tasks || []).forEach(t => { t.id = o.id + '.' + t.key; t.fid = o.id; t.o = F.length - 1; }); };
const T = id => parseNow(F[ix[id]].now);
const reached = id => st.f > ix[id];
const atF = id => st.f === ix[id];
const fromF = id => st.f >= ix[id];
const did = id => !!st.did[id];
/* Спор о доле есть, только если путь прошёл кадр «Открыт спор»: запись поступления из кадра «клиенты привязаны» перепрыгивает его (nodsp). */
const dispOn = () => st.f >= ix.dsp && !st.nodsp;
const PN = () => (PARTNERS.find(p => p.id === ctxPid()) || { name: 'МП Агент' }).name;
/* Срок выплаты по п. 6.4 считается от дня записи комиссии: кадр com */
const payDue = () => ({ due: endBD(T('com'), 15), span: endBD(T('com'), 15) - T('com'), rule: 'п. 6.4 договора: выплата в течение 15 рабочих дней после получения комиссии и определения вычетов' });
const TERMS = () => '<div class="notice" role="status">' + ic('info') + '<p class="notice__t">Условия договора HB-MP v2.1</p><ul class="stack"><li>Вознаграждение 30% от чистой выручки по покупкам ваших клиентов</li><li>После оплаты 24 часа на отказ: деньги вернутся по п. 5.1 договора</li><li>Остановить расходы можно в любой момент по п. 5.3 договора</li><li>Резерв на хвосты: 10% бюджета, не больше 500 $ по п. 4.5 договора</li></ul></div>';
/* Кто платит (поле заказа): как в живом коде, необязательное */
const PAYER = { none: 'Не указывать', individual: 'Физическое лицо', legal_entity: 'Юридическое лицо' };
const PAYER_HINT = 'Необязательно. Оплата только банковским переводом Swift на банк в Дубае, в долларах США.';
const payerSel = id => '<select class="select" id="' + id + '">' + Object.keys(PAYER).map(k => '<option value="' + k + '">' + PAYER[k] + '</option>').join('') + '</select>';
const NEWPAYER = NEW('Новое: партнёр называет, кто платит: физическое или юридическое лицо. Оплата способами из России и криптой не принимается, только Swift в долларах США.');
const reqOk = () => ['name', 'bank', 'addr', 'iban', 'swift', 'purpose'].every(k => String(st.hbreq[k] || '').trim() !== '') && /^[A-Z0-9]{8}([A-Z0-9]{3})?$/.test(st.hbreq.swift) && st.hbreq.purpose.indexOf('{invoice}') >= 0;
/* Назначение платежа: шаблон из настроек с номером счёта; пока реквизиты не заполнены - типовой текст с номером заказа */
const purposeOf = no => (reqOk() ? st.hbreq.purpose.split('{invoice}').join(no) : 'HB-MP v2.1, заказ …' + sfx() + ', счёт ' + no);
/* Счёт партнёру как в живом коде (InvoiceBlock): сумма, реквизиты Housebook из настроек (не заполнены - «Реквизиты пришлёт менеджер»), назначение платежа, «Скопировать»; PDF и оплаты картой нет; кнопки «Я оплатил(а)» нет */
const invForm = no => '<p class="note">Оплата только банковским переводом Swift на банк в Дубае, в долларах США. Другие способы не принимаются.</p>' +
  kv([['Сумма', usd(st.budget)]].concat(reqOk() ? [['Получатель', esc(st.hbreq.name)], ['Банк', esc(st.hbreq.bank)], ['Адрес банка', esc(st.hbreq.addr)], ['Номер счёта или IBAN', esc(st.hbreq.iban)], ['SWIFT/BIC', esc(st.hbreq.swift)]] : [['Реквизиты получателя', 'Реквизиты пришлёт менеджер']]).concat([['Назначение платежа', esc(purposeOf(no))]])) +
  '<div class="contact"><button class="btn" type="button" data-cpy="1">' + ic('copy') + 'Скопировать назначение платежа</button><span class="note" role="status" data-cpy-ok></span></div>' +
  '<p class="note">Оплатите счёт в течение 5 рабочих дней. После оплаты зачисление подтверждает финансовый отдел Housebook: о дате и времени вам сообщат в течение 1 рабочего дня.</p>';
const invBind = (r, no) => { const b = $('[data-cpy="1"]', r); if (b) b.onclick = () => { copy(purposeOf(no)); $('[data-cpy-ok]', r).textContent = 'Скопировано'; }; };
/* Реквизиты получателя выплаты (партнёр вносит сам): Swift в USD, банки в России не принимаются */
const PAYEE_T = { individual: 'Физическое лицо', legal_entity: 'Юридическое лицо' };
const payeeBlock = () => (st.payee
  ? '<h3 class="h4">Реквизиты получателя</h3>' + kv([['Получатель', esc(st.payee.name) + ' (' + PAYEE_T[st.payee.type].toLowerCase() + ')'], ['Банк', esc(st.payee.bank) + ' (' + esc(st.payee.country) + ')'], ['Номер счёта или IBAN', esc(st.payee.account)], ['SWIFT/BIC', esc(st.payee.swift)]])
  : '<div class="notice notice--warn" role="status">' + ic('triangle-alert') + '<p class="notice__t">Партнёр ещё не внёс реквизиты для выплаты: попросите внести их в кабинете. Оплата только Swift-переводом, в USD.</p></div>');
/* Кампания Meta: создаёт система на паузе. Название mp-{номер заказа}, лимит трат равен оплаченному, дневной бюджет равен бюджету, делённому на 30 (целые центы вниз: 2 000 $ дают 66,66 $) */
/* Переведено на баланс Facebook: база по кадру (весь лимит месяца уже покрыт) плюс частичные отметки на текущем шаге перевода */
const fbBase = () => (st.f > ix.cool2 ? 2 * st.budget : st.f >= ix.cool2 ? st.budget : st.f > ix.fnd ? st.budget : 0);
const fbDone = () => fbBase() + (st.f === ix.fnd || st.f === ix.cool2 ? st.fbPart : 0);
const capNow = () => st.budget * (st.f >= ix.cool2 ? 2 : 1);
const dayC = () => Math.floor(st.budget * 100 / 30);
const dayTxt = () => nf(Math.floor(dayC() / 100)) + ',' + pad2(dayC() % 100) + NB + '$';
const metaId = seed => '1202' + String(Array.from(seed || orderId()).reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 1e11, 7)).padStart(11, '0');
const spentNow = () => (fromF('meta') ? spentAll() : 0);
const watchAt = () => { const d = new Date(nowMs()); d.setMinutes(0, 0, 0); return dt(shiftT(d.getTime(), nowMs())); };
/* Сторож сверяет кампанию раз в час: потрачено, осталось, сверено. Партнёру: потрачено, осталось, сверено (как в коде); без номера и названия кампании, метки, ссылки с меткой, объявлений и ссылки в Meta (правило владельца 29.10.2026). */
function watchLine(P) {
  if (st.f <= ix.fnd) return '<p class="note">Сверка с Meta ещё не проводилась: сторож проверяет кампании раз в час.</p>';
  const sp = spentNow(), cap = capNow();
  if (P) return '<h3 class="h4">Сверка кампании с рекламной площадкой</h3>' + facts([['Потрачено в кампании', usd(sp)], ['Осталось из оплаченного', usd(cap - sp)], ['Сверено', watchAt() + ' (Дубай)']]) + '<p class="note">Цифры обновляются раз в час по данным рекламной площадки.</p>';
  return '<p class="note" role="status">Потрачено в Meta ' + usd(sp) + ', осталось ' + usd(cap - sp) + ' из лимита ' + usd(cap) + '. Сверено ' + watchAt() + ' (Дубай).</p>';
}
const campLine = () => '<p class="note">' + NEW('Новое: кампанию создаёт система, её номер записывается на заказе. Раньше кампанию искали в кабинете Meta по метке.') + ' Кампания создана системой на паузе: метка <b>' + tag() + '</b>, номер в Meta ' + metaId() + ', лимит трат ' + usd(capNow()) + ', в день ' + dayTxt() + '. <a href="#">Открыть в Meta</a></p>';
const fundNote = () => { const left = capNow() - fbDone(); if (left <= 0) return fromF('meta') ? '' : '<p class="note">Лимит кампании покрыт переводами полностью.</p>'; return '<p class="note">' + (fbDone() === 0 ? 'Деньги на баланс Facebook ещё не переведены: финансист отмечает перевод, после этого кампанию можно запускать.' : 'Деньги на баланс Facebook переведены не полностью: осталось перевести ' + usd(left) + '.') + '</p>'; };
const campInfo = () => '<div class="stack">' + campLine() + watchLine(false) + fundNote() + '</div>';
/* Перевод на баланс Facebook (FbBalanceFund): финансист отмечает сумму и номер платёжки, видно, сколько ещё перевести. Система деньги не переводит. */
const fundBody = () => { const lim = capNow(), left = lim - fbDone(); return '<p class="note">Лимит кампании ' + usd(lim) + '. Переведите деньги на баланс рекламного аккаунта Facebook своим способом и отметьте сумму здесь. Система деньги не переводит.</p>' +
  '<div class="hb-grid hb-grid--2">' + field('fb1', 'Переведено, $', '<input class="input" id="fb1" inputmode="decimal" value="' + nf(left) + '">', 'Осталось перевести ' + usd(left) + '.') + field('fb2', 'Номер платёжки', '<input class="input" id="fb2" autocomplete="off">', 'Необязательно.') + '</div>' + errBox('fbE'); };
const fundBind = r => $('#fb1', r).addEventListener('input', () => { $('#fbE', r).hidden = true; });
const fundGo = r => {
  const n = num($('#fb1', r).value), lim = capNow();
  if (isNaN(n) || n <= 0) return fe('fbE', 'Введите сумму перевода в долларах, например 2000.', r);
  if (fbDone() + n > lim) return fe('fbE', 'Больше лимита кампании: осталось перевести ' + usd(lim - fbDone()) + '.', r);
  st.fbPart += n;
  if (fbDone() < lim) { toast('Перевод отмечен. Осталось перевести ' + usd(lim - fbDone()) + '.', 'warn'); render(); return false; }
  return true;
};

fr({ id: 'req', ls: 0, now: '12.10.2026 11:05', ev: 'Партнёр подал заявку.', pev: 'Заявка подана.', tasks: [{
  key: 'admit', role: 'dept', lane: 'launch', short: 'Допустить заявку', pw: 'рассматривает вашу заявку и решает, допустить ли вас', due: () => dueBD(parseNow('12.10.2026 10:42'), 1, 'Рассмотрение заявки: 1 рабочий день от подачи.'),
  title: () => 'Пришла заявка от «' + PN() + '». Позвоните, убедитесь, что партнёр понимает условия, и решите: допустить или отказать.',
  form: () => facts([['Кто подал', PN()], ['Откуда', 'Из кабинета агента'], ['Страна', 'ОАЭ'], ['Подана', '12.10.2026 10:42 (Дубай)']]),
  primary: () => 'Допустить «' + PN() + '» к программе', toast: 'Допуск выдан. Агент получил уведомление в кабинете.',
  after: ['Агент увидит раздел «Медиапартнёр» в своём кабинете (учётка у него уже есть, письмо с паролем не нужно)', 'Заявка уйдёт из очереди «Заявки к допуску»', 'Откроется шаг 2 «Допуск»'] }] });

fr({ id: 'adm', ls: 1, now: '14.10.2026 09:30', ev: 'Допуск открыт. Партнёр читает условия в своём кабинете.', pev: 'Вам открыт допуск.', tasks: [
  { key: 'order', role: 'partner', lane: 'launch', short: 'Оформить заказ', waitTxt: 'партнёр читает условия и оформляет заказ', pw: '', due: null,
    title: 'Прочитайте условия договора и оформите заказ: выберите рынок и бюджет, примите условия. Принятие условий - это ваша подпись.',
    form: () => TERMS() +
      '<div class="hb-grid hb-grid--2">' +
      field('mk', 'Рынок', '<select class="select" id="mk"><option value="dubai">Дубай</option><option value="thailand">Таиланд</option><option value="trust">Доверяю Housebook</option></select>') +
      field('bd', 'Бюджет в месяц, $', '<input class="input" type="text" id="bd" inputmode="decimal" value="2' + NB + '000">', 'Не меньше ' + usd2(2000) + ' в месяц, не больше ' + usd2(4000) + ': это остаток лимита первого цикла.', 'bdE') +
      '</div><div class="field"><label>Страны рекламы (по рынку)</label><div class="chips" id="terr"></div><p class="field__hint">Россия запрещена договором (п. 4.9), её здесь нет.</p></div>' +
      field('py', 'Кто платит ' + NEWPAYER, payerSel('py'), PAYER_HINT) +
      '<label class="check"><input type="checkbox" id="acc"><span><b>Принимаю условия договора HB-MP v2.1</b></span></label>' + errBox('ordE'),
    bind: r => {
      const mk = $('#mk', r), bd = $('#bd', r), terr = $('#terr', r), pb = $('[data-k="primary"]', r);
      mk.value = st.market; bd.value = nf(st.budget); $('#py', r).value = st.payer;
      const upd = () => { const m = MK[mk.value]; terr.innerHTML = m.terr.map(t => pill(t)).join(''); const n = num(bd.value); pb.textContent = 'Отправить заказ на ' + (isNaN(n) ? '?' : usd(n)); $('#bdE', r).hidden = true; accClear(r); };
      mk.addEventListener('change', upd); bd.addEventListener('input', upd); $('#acc', r).addEventListener('change', upd); upd();
    },
    go: r => {
      const n = num($('#bd', r).value);
      if (isNaN(n)) return fe('bdE', 'Введите сумму в долларах, например 2000.', r);
      if (n < 2000) return fe('bdE', 'Минимум 2 000 $ в месяц (п. 4.1 договора).', r);
      if (n > 4000) return fe('bdE', 'Выше лимита первого цикла (4 000 $): такой платёж принять нельзя. Снизьте бюджет.', r);
      if (!$('#acc', r).checked) return accErr(r, 'Отметьте, что принимаете условия договора: это ваша подпись под заказом.');
      st.market = $('#mk', r).value; st.budget = n; st.spent = Math.round(n * 0.75); st.refund = 0; st.orderBy = 'partner'; st.payer = $('#py', r).value; return true;
    },
    primary: 'Отправить заказ на 2 000 $', toast: 'Заказ отправлен. Housebook подтвердит его и выставит счёт.',
    after: ['Партнёрский отдел увидит заказ и подтвердит его', 'В журнале запишется: заказ оформил партнёр сам', 'Дальше ход Housebook: подтвердить заказ и выставить счёт'] },
  { key: 'byDept', role: 'dept', lane: 'launch', short: 'Оформить заказ за партнёра', optional: true, advance: true, due: null,
    title: 'Не ждать партнёра: оформить заказ за него после разговора. Оба пути равноправны, в журнале будет видно, кто оформил.',
    primary: 'Оформить заказ за партнёра', toast: 'Переходим к заказу за партнёра.', fx: () => { st.orderBy = 'dept'; } }] });

fr({ id: 'ord', ls: 2, now: '15.10.2026 10:12', ev: 'Заказ ждёт подтверждения.', pev: 'Заказ отправлен.', tasks: [{
  key: 'confirm', role: 'dept', lane: 'launch', short: () => (st.orderBy === 'partner' ? 'Подтвердить заказ партнёра' : 'Создать заказ за партнёра'), pw: 'проверяет и подтверждает ваш заказ', due: () => dueBD(T('ord'), 1, 'Подтверждение заказа отделом: 1 рабочий день.'),
  title: () => (st.orderBy === 'partner' ? 'Партнёр оформил заказ сам и принял условия, это его подпись. Проверьте параметры и подтвердите заказ.' : 'Оформите заказ за партнёра: рынок и бюджет. Страны подставятся сами.'),
  form: () => st.orderBy === 'partner'
    ? facts([['Рынок', MK[st.market].name], ['Бюджет в месяц', usd(st.budget)], ['Страны', MK[st.market].terr.join(', ')], ['Кто платит', PAYER[st.payer]], ['Кто оформил', 'партнёр сам, 15.10.2026 10:05'], ['Подпись', 'принял условия HB-MP v2.1 галкой']])
    : '<div class="hb-grid hb-grid--2">' +
      field('mk', 'Рынок', '<select class="select" id="mk"><option value="dubai">Дубай</option><option value="thailand">Таиланд</option><option value="trust">Доверяю Housebook</option></select>') +
      field('bd', 'Бюджет в месяц, $', '<input class="input" type="text" id="bd" inputmode="decimal" value="2' + NB + '000">', 'Не меньше 2' + NB + '000 $ (п. 4.1 договора). В первый цикл партнёр может внести не больше 4' + NB + '000 $ суммарно.', 'bdE') +
      '</div><div class="field"><label>Страны рекламы (подставлены по рынку)</label><div class="chips" id="terr"></div><p class="field__hint">Россия запрещена договором (п. 4.9), её здесь нет.</p></div>' +
      field('py', 'Кто платит', payerSel('py'), PAYER_HINT),
  bind: r => {
    if (st.orderBy === 'partner') return;
    const mk = $('#mk', r), bd = $('#bd', r), terr = $('#terr', r), pb = $('[data-k="primary"]', r);
    mk.value = st.market; bd.value = nf(st.budget); $('#py', r).value = st.payer;
    const upd = () => { const m = MK[mk.value]; terr.innerHTML = m.terr.map(t => pill(t)).join(''); const n = num(bd.value); pb.textContent = 'Создать заказ «' + m.name + ', ' + (isNaN(n) ? '?' : usd(n)) + ' в месяц»'; $('#bdE', r).hidden = true; };
    mk.addEventListener('change', upd); bd.addEventListener('input', upd); upd();
  },
  go: r => {
    if (st.orderBy === 'partner') return true;
    const n = num($('#bd', r).value);
    if (isNaN(n)) return fe('bdE', 'Введите сумму в долларах, например 2000.', r);
    if (n < 2000) return fe('bdE', 'Минимум 2 000 $ в месяц (п. 4.1 договора).', r);
    if (n > 4000) return fe('bdE', 'Выше лимита первого цикла (4 000 $): такой платёж принять нельзя. Снизьте бюджет или сначала повысьте лимит.', r);
    st.market = $('#mk', r).value; st.budget = n; st.spent = Math.round(n * 0.75); st.refund = 0; st.payer = $('#py', r).value; return true;
  },
  primary: () => (st.orderBy === 'partner' ? 'Подтвердить заказ' : 'Создать заказ'), toast: 'Заказ подтверждён со статусом «Оформляется».',
  after: () => ['Появится заказ и лента денег по нему', 'В журнале будет видно, кто оформил: ' + (st.orderBy === 'partner' ? 'партнёр сам' : 'партнёрский отдел за партнёра'), st.orderBy === 'partner' ? 'Дальше ход финансиста: выставить счёт (условия партнёр уже принял галкой)' : 'Партнёру придёт задача принять условия договора: это его подпись'] }] });

fr({ id: 'ctr', ls: 2, skip: () => st.orderBy === 'partner', now: '15.10.2026 11:10', ev: 'Партнёр принимает условия договора.', get pev() { return st.orderBy === 'dept' ? 'Заказ подтверждён: примите условия.' : 'Условия вы приняли при оформлении заказа. Housebook готовит счёт.'; }, tasks: [{
  key: 'accept', role: 'partner', lane: 'launch', cond: () => st.orderBy === 'dept', short: 'Принять условия договора', waitTxt: 'партнёр принимает условия договора', pw: '', due: null,
  title: 'Отдел создал заказ за вас. Прочитайте условия договора и примите их: это ваша подпись под договором, без неё счёт не выставляется.',
  form: () => facts([['Заказ', orderName()], ['Страны', MK[st.market].terr.join(', ')], ['Договор', 'HB-MP v2.1']]) + TERMS() + field('py', 'Кто платит', payerSel('py'), PAYER_HINT) +
    '<label class="check"><input type="checkbox" id="acc"><span><b>Принимаю условия договора HB-MP v2.1</b></span></label>' + errBox('ordE'),
  bind: r => { $('#py', r).value = st.payer; $('#acc', r).addEventListener('change', () => accClear(r)); },
  go: r => { if (!$('#acc', r).checked) return accErr(r, 'Отметьте, что принимаете условия договора: это ваша подпись.'); st.payer = $('#py', r).value; return true; },
  primary: 'Принять условия договора', toast: 'Условия приняты. Housebook выставит счёт.',
  after: ['В журнале запишется: условия принял партнёр сам', 'Финансисту придёт задача «Выставить счёт»', 'Отметку нельзя снять, только двигаться вперёд'] }] });

fr({ id: 'inv', ls: 3, now: '15.10.2026 15:30', ev: 'Счёт ждёт выставления.', pev: 'Условия приняты.', tasks: [{
  key: 'invoice', role: 'fin', lane: 'launch', short: 'Выставить счёт', pw: () => 'выставляет вам счёт на ' + usd(st.budget), due: () => dueDay(T('ord'), 'Счёт выставляется в день подтверждения заказа.'),
  title: () => 'Выставьте партнёру счёт на ' + usd(st.budget) + ' за октябрь. Всё уже заполнено, проверьте и нажмите кнопку.',
  form: () => '<div class="hb-grid hb-grid--3">' + field('iv1', 'Период', '<input class="input" id="iv1" value="Октябрь 2026" disabled>') + field('iv2', 'Сумма', '<input class="input" id="iv2" value="' + usd(st.budget) + '" disabled>') + field('iv3', 'Номер счёта', '<input class="input" id="iv3" value="TP-2010-001" disabled>', 'Следующий свободный номер ряда') + '</div>' +
    checks(['Условия договора приняты партнёром', 'Лимит первого цикла: после счёта останется ' + usd(4000 - st.budget) + ' из ' + usd(4000)]) +
    (reqOk() ? '' : '<div class="notice notice--warn" role="status">' + ic('triangle-alert') + '<p class="notice__t">Реквизиты Housebook для оплаты не заполнены: партнёр увидит «Реквизиты пришлёт менеджер». Внести их могут финансовый директор и полный администратор в разделе «Реквизиты для оплаты» (внизу списка медиапартнёров).</p><button class="btn btn--s" type="button" data-list>Открыть список медиапартнёров</button></div>'),
  primary: () => 'Выставить счёт ' + usd(st.budget) + ' партнёру', toast: 'Счёт TP-2010-001 выставлен. Партнёр видит его в кабинете.',
  after: () => ['Партнёр увидит задачу «Оплатить счёт» с суммой, реквизитами Housebook из настроек и назначением платежа (пока реквизиты не заполнены, он увидит «Реквизиты пришлёт менеджер»)', 'Платёж получит статус «Ждём оплату»', 'Дальше ход партнёра: он платит Swift-переводом в долларах, потом вы подтверждаете поступление'] }] });

fr({ id: 'pay', ls: 3, now: '19.10.2026 14:20', ev: 'Счёт выставлен. Партнёр платит Swift-переводом; когда деньги придут на счёт Housebook, финансист подтверждает поступление.', pev: 'Счёт выставлен.', tasks: [{
  key: 'pay', role: 'partner', lane: 'launch', short: () => 'Оплатить счёт TP-2010-001', waitTxt: 'партнёр оплачивает счёт TP-2010-001', pw: '', due: () => dueBD(T('inv'), 5, 'Оплата счёта партнёром: 5 рабочих дней.'),
  title: () => 'Оплатите счёт TP-2010-001 Swift-переводом в долларах. В назначении платежа укажите номер счёта. Кнопки «Я оплатил(а)» нет: зачисление подтверждает финансист, когда деньги придут на счёт Housebook.',
  form: () => invForm('TP-2010-001'),
  bind: r => invBind(r, 'TP-2010-001'),
  primary: null },
{ key: 'confirm', role: 'fin', lane: 'launch', short: () => 'Подтвердить поступление по счёту TP-2010-001', pw: 'проверяет, что ваш платёж пришёл, и подтверждает его',
  due: () => dueBD(T('inv'), 6, 'Подтверждение поступления: 1 рабочий день после срока оплаты (5 рабочих дней на оплату и 1 на подтверждение).'),
  title: () => 'Деньги по счёту TP-2010-001 пришли на счёт Housebook? Сверьте ' + usd(st.budget) + ' с выпиской банка и нажмите «Подтвердить поступление». Задача открыта сразу, как только счёт выставлен: деньги могут прийти в любой момент.',
  form: () => facts([['Счёт', 'TP-2010-001 за октябрь'], ['Ждём', usd(st.budget)], ['Время прихода', 'сейчас (' + dt(nowMs()) + ' Дубай)']]) +
    '<label class="check"><input type="checkbox" id="ck"><span><b>Сверил(а) с банковской выпиской:</b> ' + usd(st.budget) + ' пришли от «' + PN() + '»</span></label>' + errBox('blockE'),
  bind: r => $('#ck', r).addEventListener('change', () => { $('#blockE', r).hidden = true; }),
  go: r => { if (!$('#ck', r).checked) return fe('blockE', 'Сначала отметьте, что сверили выписку.', r); return true; },
  primary: () => 'Подтвердить поступление ' + usd(st.budget), toast: 'Поступление подтверждено. Пошли 24 часа на отказ.',
  after: ['Шаг «Деньги зачислены на счёт Housebook» закрыт, платёж: «Деньги пришли»', 'Включится таймер 24 часа на отказ (на деве 1 минута)', 'Партнёр получит уведомление «Платёж зачислен»'] }] });

/* Кадр «Деньги ждут подтверждения» слит с кадром оплаты: в коде задача финансиста «Подтвердить поступление» появляется вместе с задачей партнёра «Оплатить счёт» (now-model.ts), без промежутка. Кадр остаётся в списке, чтобы не сдвигать номера, и пропускается. */
fr({ id: 'cnf', ls: 4, skip: () => true, now: '19.10.2026 14:20', ev: 'Деньги ждут подтверждения.', pev: 'Оплата получена банком.', tasks: [] });

fr({ id: 'win', ls: 5, now: '19.10.2026 14:25', timer: 23 * 3600 + 55 * 60, sys: 'Таймер окна отказа', ev: 'Идут 24 часа, в которые партнёр вправе отказаться. Запуск откроется сам, ничего нажимать не нужно.', pev: 'Идут 24 часа на отказ.', tasks: [
  { key: 'refuse', role: 'partner', lane: 'launch', short: 'Партнёр может отказаться от заказа', optional: true, big: true, waitTxt: 'партнёр может отказаться',
    due: () => ({ due: parseNow('20.10.2026 14:20'), span: DAY, rule: 'п. 5.1 договора: 24 часа с момента зачисления очищенных средств' }),
    title: () => 'Идут 24 часа, когда вы можете отказаться от заказа и вернуть ' + usd(st.budget),
    form: () => '<p>Реклама запустится сама, если вы не откажетесь: ничего нажимать не нужно. Деньги за это время не тратятся.</p><div class="stat stat--s"><span>До конца окна отказа (20.10.2026, 14:20 по Дубаю)</span><b data-tick id="tickMain">--</b></div>',
    danger: { label: () => 'Отказаться и вернуть ' + usd(st.budget), ask: { keep: 'Не отказываться', title: 'Отказаться от заказа?', text: 'Платёж вернётся вам, заказ не запустится. Отменить отказ нельзя. Если хотите, расскажите, почему передумали: это поможет нам стать лучше.', ok: 'Да, отказаться и вернуть деньги', reason: 'opt' }, halt: 'refuse', by: 'partner' },
    after: ['Деньги вернутся вам тем же способом, которым вы платили', 'Заказ не запустится', 'Если вы ничего не сделаете, реклама запустится сама после окна'] },
  { key: 'rec', role: 'fin', lane: 'launch', short: 'Записать отказ партнёра', optional: true, due: null,
    title: 'Партнёр сообщил об отказе не через кабинет? Запишите отказ вручную.',
    danger: { label: 'Партнёр отказался: записать отказ', ask: { keep: 'Не записывать отказ', title: 'Записать отказ партнёра?', text: 'Платёж вернётся партнёру, выйдет из лимита и бюджета, запустить заказ по нему будет нельзя. Отменить отказ нельзя.', ok: 'Да, записать отказ', reason: false }, halt: 'refuse', by: 'fin' },
    after: ['Когда таймер дойдёт до нуля, заказ запустится сам'] }] });

fr({ id: 'go', ls: 6, now: '20.10.2026 14:30', sys: 'Система (запуск заказа)', wait: 'Сейчас ход системы: окно отказа закрыто, заказ запускается сам, кампания в Meta создаётся на паузе. Если заказ не запустится, партнёрскому отделу придёт задача запустить его вручную.', nw: 'Новое: после окна отказа система сама запускает заказ и создаёт кампанию в Meta на паузе: название mp-{номер заказа}, лимит трат равен оплаченному, дневной бюджет равен бюджету, делённому на 30. Финансисту и маркетингу уходят задачи.', ev: 'Окно отказа закрыто, заказ запускается сам. Следом система создаёт кампанию в Meta на паузе.', pev: 'Окно отказа закрыто, заказ запускается.', tasks: [{
  key: 'launch', role: 'dept', lane: 'launch', fallback: true, optional: true, advance: true, short: 'Запустить заказ вручную', due: null,
  title: 'Заказ запускается сам после 24 часов, если допуск открыт. Эта кнопка - запасной вариант на случай, когда автозапуск не сработал.',
  primary: 'Запустить заказ вручную', toast: 'Заказ запущен. Система создаёт кампанию в Meta на паузе.',
  after: ['Статус заказа: «Реклама идёт»', 'Система создаст кампанию в Meta на паузе. Если не вышло и причина не разовая, админу придёт красная задача с причиной', 'Партнёр получит уведомление «Заказ запущен»'] }] });

fr({ id: 'fnd', ls: 7, now: '20.10.2026 15:10', ev: 'Система создала кампанию в Meta на паузе. Финансист переводит деньги на баланс Facebook, маркетинг ждёт.', pev: 'Housebook готовит рекламу: деньги переводятся на рекламный счёт.', tasks: [{
  key: 'fund', role: 'fin', lane: 'launch', short: () => 'Перевести ' + usd(capNow() - fbDone()) + ' на баланс рекламного аккаунта Facebook', pw: 'переводит деньги на рекламный счёт', due: null,
  title: () => 'Кампания ' + tag() + ' создана системой на паузе. Переведите ' + usd(capNow() - fbDone()) + ' на баланс рекламного аккаунта Facebook и отметьте перевод.',
  form: () => '<p class="note">' + NEW('Новое: шаг «Деньги на балансе Facebook». Пока на баланс не переведён весь лимит кампании, у маркетинга кнопка «Кампания запущена» закрыта.') + ' Кампания <b>' + tag() + '</b>, лимит ' + usd(capNow()) + ', в день ' + dayTxt() + '.</p>' + fundBody(),
  bind: fundBind, go: fundGo,
  primary: 'Деньги на балансе Facebook', toast: 'Перевод отмечен: лимит кампании покрыт. Маркетинг может запускать кампанию.',
  after: ['Шаг «Деньги на балансе Facebook» закрывается, когда переведён весь лимит кампании', 'Маркетингу откроется кнопка «Кампания запущена»', 'Система деньги не переводит: перевод вы делаете сами, своим способом'] }] });

fr({ id: 'cmp', ls: 8, now: '20.10.2026 16:20', ev: 'Деньги на балансе Facebook. Кампания ждёт запуска маркетингом.', pev: 'Деньги на рекламном счёте: кампания ждёт запуска.', tasks: [{
  key: 'start', role: 'mkt', lane: 'launch', since: 'fnd', short: () => 'Запустить кампанию ' + tag(), pw: 'запускает вашу рекламу', due: () => dueBD(T('go'), 1, 'Запуск кампании маркетингом: 1 рабочий день после запуска заказа.'),
  lock: () => (st.f < ix.cmp ? 'Сначала финансист переводит на баланс Facebook весь лимит кампании и отмечает перевод.' : ''),
  title: () => 'Запустить кампанию ' + tag() + ', бюджет ' + usd(capNow()) + (st.f < ix.cmp ? ' (после перевода денег на баланс Facebook, не хватает ' + usd(capNow() - fbDone()) + ')' : '') + '. Включите её в рекламном кабинете Meta и нажмите кнопку.',
  form: () => campLine() + (st.f < ix.cmp ? '<p class="note">' + NEW('Новое: кнопка закрыта, пока на баланс Facebook не переведён весь лимит кампании.') + '</p>' : '<p class="note">Деньги кнопка не трогает.</p>') +
    '<div class="field"><label for="lnk">Ссылка с меткой кампании ' + NEW('Сейчас метку собирают руками из полного номера заказа, которого нигде не видно. Предложение: показывать готовую ссылку и копировать одной кнопкой.') + '</label><div class="copy"><input class="input" id="lnk" readonly value="' + esc(link()) + '"><button class="btn" type="button" id="cp">' + ic('copy') + 'Скопировать ссылку с меткой</button></div><p class="field__hint">Метка <b>' + tag() + '</b> в ссылках объявлений: по ней система привяжет к заказу каждую заявку.</p></div>',
  bind: r => $('#cp', r).addEventListener('click', () => { copy($('#lnk', r).value); toast('Ссылка с меткой скопирована', 'ok'); }),
  primary: 'Кампания запущена', toast: 'Отмечено: кампания запущена. Путь «Запуск» пройден, дорожки работы открыты.',
  after: ['Партнёр увидит, что реклама пошла', 'Сторож раз в час сверяет потраченное и остаток лимита кампании', 'Откроются дорожки «Работа»: реклама, клиенты, комиссии и выплаты, следующий месяц'] }] });

fr({ id: 'meta', ls: 9, now: '31.10.2026 18:00', ev: 'Октябрь закончился. Сверка показывает потраченное, расход периода вносится вручную.', pev: 'Октябрь закончился.', tasks: [{
  key: 'check', role: 'mkt', lane: 'ads', short: 'Внести расход за октябрь', pw: 'вносит расход за октябрь', due: null,
  title: 'Октябрь закончился. Сверка кампании показывает потраченное и остаток лимита, но расход периода для отчётности не пишет: внесите его по данным рекламного кабинета Meta.',
  form: () => watchLine(false) +
    '<div class="hb-grid hb-grid--2">' + field('ms', 'Потрачено за октябрь, $', '<input class="input" id="ms" inputmode="decimal" value="' + st.spent + '">', 'По сверке в Meta: ' + usd(st.spent)) + field('mr', 'Возврат площадки, $', '<input class="input" id="mr" inputmode="decimal" value="' + st.refund + '">', 'Пусто - ноль') + '</div>' + errBox('msE') +
    kv([['Резерв на хвосты (считает система)', usd(reserveOf()) + ' <span class="note">меньшее из 10% бюджета и 500 $, п. 4.5</span>'], ['Остаток партнёра (считает система)', '<b>' + usd(restOf()) + '</b>']]) +
    '<div class="contact"><button class="btn" type="button" id="cp">' + ic('copy') + 'Скопировать ссылку с меткой</button></div>',
  bind: r => { $('#cp', r).addEventListener('click', () => { copy(link()); toast('Ссылка с меткой скопирована', 'ok'); }); ['ms', 'mr'].forEach(i => $('#' + i, r).addEventListener('input', () => { $('#msE', r).hidden = true; })); },
  go: r => {
    const a = num($('#ms', r).value), c = num($('#mr', r).value || '0');
    if (isNaN(a) || isNaN(c) || a < 0 || c < 0) return fe('msE', 'Суммы вводятся цифрами, не меньше нуля.', r);
    if (c > a) return fe('msE', 'Возврат площадки не может быть больше расхода.', r);
    if (a + reserveOf() - c > st.budget) return fe('msE', 'Расход с резервом больше бюджета. Проверьте цифры: это перерасход.', r);
    st.spent = a; st.refund = c; st.manual = true; return true;
  },
  primary: 'Внести расход за октябрь', toast: 'Расход октября внесён. Партнёр видит цифры в кабинете.',
  after: ['Расход попадёт в раздел «Реклама и расход» и в кабинет партнёра', 'Резерв на хвосты и остаток партнёра считаются системой сами', 'Сверка раз в час продолжается: потрачено и остаток лимита кампании'] }] });

fr({ id: 'cli', ls: 7, now: '02.11.2026 10:15', ev: 'За октябрь пришли обращения с рекламы партнёра, клиенты привязываются сами. Отчёт за октябрь собран и отправлен сам.', pev: 'Клиенты привязываются сами. Ждём сделку: когда застройщик заплатит комиссию Housebook, вам начислят награду.', wait: 'Сейчас ход системы: клиенты с рекламы привязываются к заказу сами, по метке в ссылке объявления. Людям делать ничего не нужно: если заявка не привяжется сама, партнёрскому отделу придёт задача. Дальше ждём сделку: клиент покупает, застройщик платит комиссию Housebook. Когда комиссия придёт, финансист записывает поступление.', tasks: [
  { key: 'remarks', role: 'dept', lane: 'clients', short: 'Ответить на замечания партнёра к отчёту за октябрь', until: 'apr', pw: 'отвечает на ваши замечания к отчёту за октябрь', due: null, cond: () => st.remarks,
    title: 'Отчёт за октябрь собран и отправлен партнёру сам. Партнёр прислал замечания: ответьте ему.',
    form: () => facts([['Период', 'Октябрь 2026'], ['Бюджет и расход', usd(st.budget) + ' и ' + usd(st.spent)], ['Остаток', usd(restOf())], ['Обращений', taggedN()]]) + '<p class="note">Замечания партнёр вправе прислать в течение 15 рабочих дней после получения отчёта (п. 8.3).</p>',
    primary: 'Ответ партнёру отправлен', toast: 'Ответ на замечания отправлен партнёру.',
    after: ['Партнёр увидит ответ в кабинете', 'В журнале запишется ответ', 'Задача уйдёт из очереди'] },
  { key: 'link', role: 'dept', lane: 'clients', short: () => 'Решить по заявке ' + pd().c5 + ' (метка есть, привязка не прошла)', until: 'apr', pw: 'разбирает обращение, которое не привязалось само', due: () => dueBD(T('cli'), 2, 'Ручная привязка обращения: 2 рабочих дня.'), cond: () => st.excp,
    title: () => 'Заявка ' + pd().c5 + ': метка кампании есть, но привязка не прошла, потому что заявка пришла 19.10, до запуска заказа. Решите: привязать к заказу или оставить без заказа.',
    form: () => '<p class="note">Знаем точно: метка <b>' + tag() + '</b> стоит, но система не привязала. Причина: заявка пришла 19.10.2026 17:20, заказ запущен 20.10.2026 14:30.</p>',
    primary: 'Привязать к заказу', toast: () => 'Заявка ' + pd().c5 + ' привязана к заказу вручную.', fx: () => { st.excpDone = true; },
    danger: { label: 'Оставить без заказа', ask: { keep: 'Вернуться к заявке', title: 'Оставить заявку без заказа?', text: 'Заявка не будет засчитана заказу партнёра. Причина попадёт в журнал.', ok: 'Да, оставить без заказа', reason: true }, toast: 'Заявка оставлена без заказа, причина записана.', fx: () => { st.excpDone = true; } },
    after: ['Заявка уйдёт из очереди «Не привязались сами»', 'Запись попадёт в журнал: кто и что решил', 'Счётчик «ждут ручной привязки» уменьшится'] }] });

fr({ id: 'dsp', ls: 7, now: '05.11.2026 09:40', ev: 'Открыт спор о доле: у клиента есть агент.', get pev() { return did('dsp.dispute') ? 'Спор о доле решён. Ждём сделку: когда застройщик заплатит комиссию Housebook, вам начислят награду.' : 'Housebook разбирает спор о доле по одному клиенту. Параллельно ждём сделку: когда застройщик заплатит комиссию, вам начислят награду.'; },
  get wait() { return (did('dsp.dispute') ? 'Спор о доле решён. ' : 'Спор о доле разбирает партнёрский отдел. ') + 'Ждём сделку: клиент покупает, застройщик платит комиссию Housebook. Когда комиссия придёт, финансист записывает поступление.'; }, tasks: [{
  key: 'dispute', role: 'dept', lane: 'clients', short: () => 'Разобрать спор о доле по ' + pd().dp, until: 'plan', cond: () => dispOn(), pw: () => 'разбирает спор о доле по клиенту ' + pd().dp + ': у клиента уже есть агент',
  due: () => ({ due: addBD(T('dsp'), 10), span: addBD(T('dsp'), 10) - T('dsp'), rule: 'Прил. 2, п. 16-17: спор об источнике или сумме, обмен доказательствами 10 рабочих дней, потом раздел 15 договора. Бесспорное платится вовремя' }),
  title: () => 'Клиент ' + pd().dp + ' пришёл по рекламе партнёра, но у него уже есть агент. Решите, чьей доле быть: окно атрибуции 12 месяцев (п. 7.6) идёт от даты заявки.',
  form: () => facts([['Клиент', pd().dp], ['Причина спора', 'у клиента есть агент'], ['Заявка', '31.10.2026'], ['Окно атрибуции до', '31.10.2027']]),
  primary: 'Клиент остаётся за заказом партнёра', toast: 'Спор закрыт: клиент остаётся за заказом партнёра.',
  danger: { label: 'Клиент остаётся у агента', ask: { keep: 'Вернуться к спору', title: 'Оставить клиента у агента?', text: 'Клиент не будет засчитан заказу партнёра. Решение попадёт в журнал, партнёр увидит его в кабинете.', ok: 'Да, оставить клиента у агента', reason: true }, toast: 'Спор закрыт: клиент остаётся у агента.' },
  after: ['Спор уйдёт из очереди, счётчик споров уменьшится', 'Решение запишется в журнал', 'Партнёр увидит итог в кабинете'] }] });

fr({ id: 'com', ls: 7, now: '12.11.2026 12:00', ev: 'Застройщик заплатил комиссию.', pev: 'Застройщик заплатил комиссию.', tasks: [{
  /* Комиссия приходит от застройщика сама, когда сделка закрыта: это внешнее событие, его отмечает финансист. Кнопка открыта с кадра «клиенты привязаны» (с cli), как только событие может наступить: в коде записать поступление можно в любой момент, задачи на это нет, пока деньги не записаны. */
  key: 'record', role: 'fin', lane: 'deals', since: 'cli', optional: true, jump: 'plan', fx: () => { if (st.f < ix.dsp) st.nodsp = true; }, short: () => 'Записать комиссию по ' + pd().dl, pw: 'записывает комиссию, которую заплатил застройщик по вашему клиенту, и считает награду', due: () => payDue(),
  title: () => 'Застройщик заплатил комиссию по клиенту ' + pd().dl + '? Запишите поступление: сумма и НДС. Награду партнёра система посчитает сама. Кнопка открыта заранее: комиссия может прийти в любой момент после сделки.',
  form: () => '<div class="hb-grid hb-grid--2">' + field('rl', 'Клиент', '<select class="select" id="rl"><option>' + pd().dl + ' · заказ «' + MK[st.market].name + '»</option></select>', 'Заказ подставлен по клиенту') + field('rd', 'Когда получено', '<input class="input" type="datetime-local" id="rd" value="2026-11-12T12:00">', 'Время по Дубаю, не в будущем') + '</div>' +
    '<div class="hb-grid hb-grid--3">' + field('rr', 'Получено от застройщика, $', '<input class="input" id="rr" inputmode="decimal" value="10' + NB + '500">') + field('rv', 'В том числе НДС, $', '<input class="input" id="rv" inputmode="decimal" value="500">') + field('rt', 'Налоги и сборы, $', '<input class="input" id="rt" inputmode="decimal" value="0">') + '</div>' +
    '<div class="hb-grid hb-grid--2">' + field('rx', 'Спорный вычет, $', '<input class="input" id="rx" inputmode="decimal" value="0">', 'Если пусто, спора нет') + field('rn', 'Основание вычетов (видно партнёру)', '<textarea class="textarea" id="rn">НДС 5% по счёту застройщика</textarea>') + '</div>' + resBox('rc') + errBox('blockE'),
  bind: r => {
    const upd = () => {
      const a = num($('#rr', r).value), v = num($('#rv', r).value || '0'), t = num($('#rt', r).value || '0'), x = num($('#rx', r).value || '0'), box = $('#rc .notice__t', r);
      if ([a, v, t, x].some(isNaN)) { box.textContent = 'Введите суммы цифрами.'; return; }
      const net = a - v - t; if (net < 0) { box.textContent = 'Вычеты больше полученной суммы.'; return; }
      const rew = Math.round(net * 0.3), und = Math.round((net - x) * 0.3); $('[data-k="primary"]', r).textContent = 'Записать поступление ' + usd(a); st.reward = rew;
      box.innerHTML = 'Чистая база: ' + usd(a) + ' - ' + usd(v) + ' - ' + usd(t) + ' = <b>' + usd(net) + '</b>. Награда партнёра 30%: <b>' + usd(rew) + '</b>' + (x > 0 ? ' (сразу ' + usd(und) + ', после решения по спору ' + usd(rew - und) + ')' : '') + '. Срок выплаты: <b>до 03.12.2026</b> (15 рабочих дней).';
    };
    ['rr', 'rv', 'rt', 'rx'].forEach(i => $('#' + i, r).addEventListener('input', upd)); upd();
  },
  go: r => {
    const a = num($('#rr', r).value), v = num($('#rv', r).value || '0'), t = num($('#rt', r).value || '0'), x = num($('#rx', r).value || '0');
    if ([a, v, t, x].some(isNaN) || a <= 0) return fe('blockE', 'Введите суммы цифрами, получено больше нуля.', r);
    if (a - v - t < 0 || x > a - v - t) return fe('blockE', 'Вычеты больше полученной суммы.', r);
    if ((v > 0 || t > 0 || x > 0) && $('#rn', r).value.trim() === '') return fe('blockE', 'Укажите основание вычета: вид, основание и процент (п. 3.8).', r);
    return true;
  },
  primary: 'Записать поступление', toast: 'Поступление записано. Награда партнёра посчитана.',
  after: ['В разделе «Комиссии» появится строка с расчётом', 'Награда станет доступна для выплаты', 'Дальше: запланировать выплату'] }] });

fr({ id: 'plan', ls: 7, now: '12.11.2026 12:30', ev: 'Награда ждёт планирования выплаты.', pev: 'Комиссия записана, награда посчитана.', tasks: [{
  key: 'plan', role: 'fin', lane: 'deals', short: () => 'Запланировать выплату ' + usd(st.reward), pw: () => 'планирует выплату вашей награды ' + usd(st.reward), due: () => payDue(),
  title: () => 'Награда ' + usd(st.reward) + ' готова к выплате (срок до 03.12.2026). Запланируйте выплату.',
  form: () => '<label class="check"><input type="checkbox" id="pc" checked><span><b>' + pd().dl + '</b>: к выплате ' + usd(st.reward) + '<br><span class="note">поступление 12.11.2026, срок выплаты до 03.12.2026</span></span></label>' + resBox('pcc') + errBox('blockE') +
    '<ol class="steps steps--chain"><li class="step" aria-current="step"><h3>Запланировать</h3><small>Вы сейчас</small></li><li class="step"><h3>Одобрить</h3><small>другой человек, с паролем</small></li><li class="step"><h3>Перевести и отметить</h3><small>не тот, кто одобрил</small></li></ol>',
  bind: r => { const c = $('#pc', r); const u = () => { $('#pcc .notice__t', r).innerHTML = c.checked ? 'Начислено ' + usd(st.reward) + '. Зачёт возвратов 0 $. <b>К выплате ' + usd(st.reward) + '</b>' : 'Ничего не выбрано.'; $('#blockE', r).hidden = true; }; c.addEventListener('change', u); u(); },
  go: r => { if (!$('#pc', r).checked) return fe('blockE', 'Выберите хотя бы одно поступление.', r); return true; },
  primary: () => 'Запланировать выплату ' + usd(st.reward), toast: 'Выплата запланирована. Финансовому директору (Дмитрий) ушла задача одобрить.',
  after: ['Выплата получит статус «Запланирована»', 'Финансовый директор или другой финансист получит задачу «Одобрить»', 'Вы не сможете одобрить её сами: правило трёх рук'] }] });

fr({ id: 'apr', ls: 7, now: '13.11.2026 10:05', ev: 'Выплата ждёт одобрения, партнёру открыта задача подтвердить реквизиты.', pev: 'Выплата запланирована.', tasks: [
  { key: 'approve', role: 'cfo', lane: 'deals', short: () => 'Одобрить выплату ' + usd(st.reward), pw: 'одобряет выплату вашей награды', due: () => payDue(),
    title: () => 'Анна запланировала выплату ' + usd(st.reward) + ' партнёру «' + PN() + '». Проверьте и одобрите.',
    form: () => checks(['Вы не планировали эту выплату (планировала Анна)', 'По клиенту ' + pd().dl + ' нет открытого спора', 'Награда: чистая база 10' + NB + '000 $ x 30% = ' + usd(st.reward)]) +
      field('pw', 'Пароль для подтверждения', '<input class="input" type="password" id="pw" autocomplete="off" placeholder="Любой текст (демо)">', 'Ваш вход старше 15 минут, поэтому пароль нужен прямо здесь: выходить с экрана не придётся.', 'pwE'),
    bind: r => $('#pw', r).addEventListener('input', () => { $('#pwE', r).hidden = true; }),
    go: r => { if ($('#pw', r).value === '') return fe('pwE', 'Введите пароль.', r); return true; },
    primary: () => 'Одобрить выплату ' + usd(st.reward), toast: 'Выплата одобрена. Анне ушла задача перевести деньги.',
    danger: { label: 'Отменить выплату', ask: { keep: 'Не отменять выплату', title: 'Отменить выплату?', text: 'Поступление вернётся в список «к выплате», планировать придётся заново.', ok: 'Да, отменить выплату', reason: true }, back: 'plan', fx: () => { st.cancelled = true; }, toast: 'Выплата отменена, поступление вернулось в список к выплате.' },
    after: ['Выплата получит статус «Одобрена, можно переводить»', 'Задача перевести уйдёт финансисту, не одобрявшему выплату', 'Реквизиты партнёра будут на экране перевода'] },
  { key: 'reqs', role: 'partner', lane: 'deals', short: 'Внести реквизиты для выплаты', until: 'tr', waitTxt: 'партнёр вносит реквизиты для выплаты', pw: '', due: () => dueBD(T('apr'), 3, 'Реквизиты для выплаты вносит партнёр: 3 рабочих дня.'),
    title: () => 'Внесите реквизиты для выплаты вашей награды ' + usd(st.reward) + '. Housebook выплатит её до ' + fmtD(new Date(payDue().due)) + ' (п. 6.4 договора, ' + remTxt(payDue().due - nowMs()) + '). Без реквизитов выплату не провести.',
    form: () => '<p class="note">' + NEW('Новое: партнёр сам вносит реквизиты получателя, финансист видит их в карточке выплаты.') + ' Вознаграждение выплачивается банковским переводом Swift в долларах США. Банки в России не принимаются.</p>' +
      field('pe1', 'Кому платить', '<select class="select" id="pe1"><option value="individual">Физическое лицо</option><option value="legal_entity">Юридическое лицо</option></select>') +
      '<div class="hb-grid hb-grid--2">' + field('pe2', 'Имя или название получателя', '<input class="input" id="pe2" autocomplete="off">') + field('pe3', 'Банк', '<input class="input" id="pe3" autocomplete="off">') +
      field('pe4', 'Номер счёта или IBAN', '<input class="input" id="pe4" autocomplete="off">') + field('pe5', 'SWIFT/BIC банка', '<input class="input" id="pe5" autocomplete="off">') + '</div>' +
      field('pe6', 'Страна банка (код, например AE)', '<input class="input" id="pe6" maxlength="2" autocomplete="off">') + errBox('peE'),
    bind: r => {
      const p = st.payee || { type: 'legal_entity', name: '', bank: '', account: '', swift: '', country: '' };
      $('#pe1', r).value = p.type; $('#pe2', r).value = p.name; $('#pe3', r).value = p.bank; $('#pe4', r).value = p.account; $('#pe5', r).value = p.swift; $('#pe6', r).value = p.country;
      ['pe1', 'pe2', 'pe3', 'pe4', 'pe5', 'pe6'].forEach(i => $('#' + i, r).addEventListener('input', () => { $('#peE', r).hidden = true; }));
    },
    go: r => {
      const p = { type: $('#pe1', r).value, name: $('#pe2', r).value.trim(), bank: $('#pe3', r).value.trim(), account: $('#pe4', r).value.trim(), swift: $('#pe5', r).value.trim().toUpperCase(), country: $('#pe6', r).value.trim().toUpperCase() };
      if (p.country === 'RU') return fe('peE', 'Банки в России не принимаются: укажите банк в другой стране.', r);
      if (!p.name || !p.bank || !p.account || !/^[A-Z0-9]{8}([A-Z0-9]{3})?$/.test(p.swift) || !/^[A-Z]{2}$/.test(p.country)) return fe('peE', 'Проверьте поля: реквизиты заполнены не полностью или неверно.', r);
      st.payee = p; return true;
    },
    primary: 'Сохранить реквизиты', toast: 'Реквизиты сохранены.',
    after: ['Финансист увидит реквизиты в карточке выплаты', 'Награда будет переведена до срока выплаты, Swift-переводом в долларах', 'Вы получите уведомление «Выплачено» с номером банковского документа'] }] });

fr({ id: 'inv2', ls: 7, now: '14.11.2026 11:00', ev: 'Начался выбор следующего месяца: счёт на ноябрь.', pev: 'Housebook выставляет счёт на ноябрь.', tasks: [{
  key: 'invoice', role: 'fin', lane: 'next', short: () => 'Выставить счёт на ноябрь ' + usd(st.budget), pw: () => 'выставляет вам счёт на ноябрь ' + usd(st.budget), due: null,
  title: () => 'Партнёр продолжает: выставьте счёт на ноябрь, ' + usd(st.budget) + '. Это идёт параллельно с выплатой за октябрь.',
  form: () => '<div class="hb-grid hb-grid--3">' + field('iv1', 'Период', '<input class="input" value="Ноябрь 2026" disabled>') + field('iv2', 'Сумма', '<input class="input" value="' + usd(st.budget) + '" disabled>') + field('iv3', 'Номер счёта', '<input class="input" value="TP-2011-001" disabled>') + '</div>' +
    '<p class="note">Платёж за очередной месяц на согласованных параметрах подтверждает новый период. Автосписания нет (п. 4.1). Неиспользованный остаток октября переносится на следующий месяц.</p>',
  primary: () => 'Выставить счёт ' + usd(st.budget) + ' на ноябрь', toast: 'Счёт TP-2011-001 выставлен. Партнёр видит его в кабинете.',
  after: ['Партнёру откроется задача «Оплатить счёт на ноябрь»', 'Оплата и 24 часа повторяют запуск, идут параллельно с выплатой за октябрь'] }] });

fr({ id: 'tr', ls: 7, now: '16.11.2026 15:10', ev: 'Выплата одобрена, ждёт перевода.', pev: 'Выплата одобрена.', tasks: [
  { key: 'transfer', role: 'fin', lane: 'deals', short: () => 'Перевести выплату ' + usd(st.reward), pw: () => 'переводит вам награду ' + usd(st.reward), due: () => payDue(),
    title: () => 'Выплата одобрена. Переведите ' + usd(st.reward) + ' по реквизитам партнёра и впишите номер банковского документа.',
    form: () => payeeBlock() + kv([['Сумма', usd(st.reward)], ['Назначение', 'Reward under HB-MP v2.1, payout 16.11.2026']]) +
      '<div class="hb-grid hb-grid--2">' + field('bk', 'Номер банковского документа', '<input class="input" id="bk" autocomplete="off" placeholder="например BD-20261116-77">', '', 'bkE') + field('bt', 'Когда переведено', '<input class="input" type="datetime-local" id="bt" value="2026-11-16T15:10">') + '</div>',
    bind: r => $('#bk', r).addEventListener('input', () => { $('#bkE', r).hidden = true; }),
    go: r => { const v = $('#bk', r).value.trim(); if (v === '') return fe('bkE', 'Без номера документа выплата не отмечается оплаченной.', r); st.bank = v; return true; },
    primary: () => 'Подтвердить, что перевёл ' + usd(st.reward), toast: 'Выплата отмечена оплаченной. Партнёр получил уведомление.',
    after: ['Выплата получит статус «Выплачена»', 'Партнёр увидит перевод и номер документа', 'Дорожка выплат по этой сделке завершена'] },
  { key: 'pay2', role: 'partner', lane: 'next', short: 'Оплатить счёт TP-2011-001 на ноябрь', until: 'cn2', cond: () => !did('tr.confirm2'), waitTxt: 'партнёр оплачивает счёт на ноябрь', pw: '', due: () => dueBD(T('inv2'), 5, 'Оплата счёта партнёром: 5 рабочих дней.'),
    title: () => 'Оплатите счёт TP-2011-001 Swift-переводом в долларах. В назначении платежа укажите номер счёта. Кнопки «Я оплатил(а)» нет: зачисление подтверждает финансист.',
    form: () => invForm('TP-2011-001'),
    bind: r => invBind(r, 'TP-2011-001'),
    primary: null },
  /* Деньги за ноябрь могут прийти, как только выставлен счёт, то есть уже сейчас, пока выплата за октябрь ещё не переведена: кнопка финансиста открыта сразу и кадр не двигает. Кадр «Платёж за ноябрь» пропускается, если поступление уже подтверждено здесь. */
  { key: 'confirm2', role: 'fin', lane: 'next', stay: true, short: () => 'Подтвердить поступление за ноябрь ' + usd(st.budget), pw: 'подтверждает поступление оплаты за ноябрь',
    due: () => dueBD(T('inv2'), 6, 'Подтверждение поступления: 1 рабочий день после срока оплаты (5 рабочих дней на оплату и 1 на подтверждение).'),
    title: () => 'Партнёр оплатил ноябрь? Деньги по счёту TP-2011-001 могут прийти в любой момент, не дожидаясь перевода выплаты за октябрь. Сверьте ' + usd(st.budget) + ' с выпиской банка и подтвердите поступление.',
    form: () => facts([['Счёт', 'TP-2011-001 за ноябрь'], ['Ждём', usd(st.budget)], ['Время прихода', 'сейчас (' + dt(nowMs()) + ' Дубай)']]) + '<label class="check"><input type="checkbox" id="ck"><span><b>Сверил(а) с банковской выпиской</b></span></label>' + errBox('blockE'),
    bind: r => $('#ck', r).addEventListener('change', () => { $('#blockE', r).hidden = true; }),
    go: r => { if (!$('#ck', r).checked) return fe('blockE', 'Сначала отметьте, что сверили выписку.', r); return true; },
    primary: () => 'Подтвердить поступление ' + usd(st.budget), toast: 'Поступление за ноябрь подтверждено. Пошли 24 часа на отказ.',
    after: ['Платёж за ноябрь: «Деньги пришли»', 'Идут 24 часа на отказ', 'Выплата за октябрь остаётся у финансиста: её можно перевести в любой момент, ноябрь запустится сам'] }] });

fr({ id: 'cn2', ls: 7, skip: () => did('tr.confirm2'), now: '17.11.2026 10:00', ev: 'Платёж за ноябрь ждёт подтверждения.', pev: 'Оплата за ноябрь получена банком.', tasks: [{
  key: 'confirm', role: 'fin', lane: 'next', short: () => 'Подтвердить поступление за ноябрь ' + usd(st.budget), pw: 'подтверждает поступление оплаты за ноябрь',
  due: () => ({ due: addBD(T('cn2'), 1), span: DAY, rule: 'Прил. 1, п. 4: Housebook сообщает партнёру дату и время поступления в течение 1 рабочего дня' }),
  title: () => 'Партнёр оплатил ноябрь? Сверьте ' + usd(st.budget) + ' с выпиской банка и подтвердите поступление.',
  form: () => facts([['Счёт', 'TP-2011-001 за ноябрь'], ['Ждём', usd(st.budget)], ['Время прихода', 'сейчас (17.11.2026 10:00 Дубай)']]) + '<label class="check"><input type="checkbox" id="ck"><span><b>Сверил(а) с банковской выпиской</b></span></label>' + errBox('blockE'),
  bind: r => $('#ck', r).addEventListener('change', () => { $('#blockE', r).hidden = true; }),
  go: r => { if (!$('#ck', r).checked) return fe('blockE', 'Сначала отметьте, что сверили выписку.', r); return true; },
  primary: () => 'Подтвердить поступление ' + usd(st.budget), toast: 'Поступление за ноябрь подтверждено. Пошли 24 часа на отказ.',
  after: ['Платёж за ноябрь: «Деньги пришли»', 'Идут 24 часа на отказ (до 18.11.2026 10:00)', 'Потом ноябрь запустится сам'] }] });

fr({ id: 'cool2', ls: 7, now: '18.11.2026 10:05', sys: 'Система (запуск ноября)', nw: 'Новое: после оплаты и 24 часов на отказ система сама поднимает лимит кампании в Meta и ставит задачи: финансисту перевести разницу на баланс Facebook, маркетингу проверить кампанию.', ev: 'Окно отказа за ноябрь прошло, ноябрь запускается сам. Система подняла лимит кампании и поставила задачи финансисту и маркетингу.', pev: 'Окно отказа за ноябрь прошло, реклама на ноябрь продолжается.', tasks: [
  { key: 'fund2', role: 'fin', lane: 'next', short: () => 'Перевести ' + usd(capNow() - fbDone()) + ' на баланс рекламного аккаунта Facebook (лимит поднят)', pw: 'переводит деньги на рекламный счёт за ноябрь', due: null,
    title: () => 'Система подняла лимит кампании ' + tag() + ' с ' + usd(capNow() / 2) + ' до ' + usd(capNow()) + '. Переведите ' + usd(capNow() - fbDone()) + ' на баланс рекламного аккаунта Facebook и отметьте перевод.',
    form: () => fundBody(),
    bind: fundBind, go: fundGo,
    primary: 'Деньги на балансе Facebook', toast: 'Перевод отмечен: лимит кампании покрыт.',
    after: ['Лимит кампании покрыт переводами полностью', 'Система деньги не переводит: перевод вы делаете сами, своим способом'] },
  { key: 'check2', role: 'mkt', lane: 'next', short: () => 'Лимит кампании поднят до ' + usd(capNow()) + ': проверьте кампанию', pw: 'проверяет вашу рекламу после подъёма лимита', due: null,
    title: () => 'Лимит кампании ' + tag() + ' поднят до ' + usd(capNow()) + ': после перевода денег на баланс Facebook проверьте, что кампания идёт.',
    form: () => '<p class="note">Отдельной отметки нет: задача уйдёт сама, когда финансист отметит перевод.</p>',
    primary: null }] });

fr({ id: 'cls', ls: 8, now: '30.11.2026 11:00', ev: 'Работа по заказу закончена, ждёт закрытия.', pev: 'Заказ ждёт закрытия.', tasks: [{
  key: 'close', role: 'dept', lane: 'close', short: 'Закрыть заказ', pw: 'закрывает заказ и готовит возврат остатка', due: null,
  title: 'Выплата прошла, ноябрь отработан. Если работа по заказу закончена, закройте его: он уйдёт в архив.',
  form: () => '<div class="notice" role="status">' + ic('info') + '<p><b>Если партнёр продолжает</b>, заказ не закрывайте: каждый месяц повторяется шаг «Счёт» и дальше по кругу.</p></div>' + closeReady(),
  primary: null,
  danger: { label: 'Закрыть заказ', ask: { keep: 'Оставить заказ открытым', title: 'Закрыть заказ?', text: 'Закрытый заказ нельзя вернуть в работу: платежи, расход и остановки по нему больше не принимаются. Остаток бюджета вернётся партнёру. Открытые сделки продолжаются: окно атрибуции и выплаты идут до конца (п. 7.7).', ok: 'Да, закрыть заказ', reason: false }, toast: 'Заказ закрыт. Финансисту ушла задача вернуть остаток.', complete: true },
  after: ['Заказ уйдёт в «Архив»', 'Система сразу поставит кампанию в Meta на паузу; если пауза не пройдёт, маркетингу придёт красная задача остановить кампанию вручную', 'Финансист получит задачу вернуть остаток бюджета', 'Партнёр получит уведомление о закрытии'] }] });

fr({ id: 'ref', ls: 8, now: '02.12.2026 12:00', ev: 'Остаток ждёт возврата партнёру.', pev: 'Заказ закрыт.', tasks: [{
  key: 'refund', role: 'fin', lane: 'close', short: () => 'Вернуть остаток ' + usd(restAll()), pw: () => 'возвращает вам неиспользованный остаток ' + usd(restAll()),
  due: () => ({ due: endBD(T('ref'), 10), span: endBD(T('ref'), 10) - T('ref'), rule: 'п. 5.6 договора: бесспорный остаток возвращается в течение 10 рабочих дней после сверки' }),
  title: () => 'Заказ закрыт. Верните партнёру неиспользованный остаток ' + usd(restAll()) + '.',
  form: () => '<div class="notice" role="status">' + ic('equal') + '<p class="notice__t">' + usd(takenAll()) + ' принято - ' + usd(spentAll()) + ' потрачено - ' + usd(reserveOf()) + ' резерв на хвосты = <b>' + usd(restAll()) + '</b> к возврату</p></div>' +
    field('rb', 'Номер банковского документа', '<input class="input" id="rb" autocomplete="off" placeholder="например BD-20261202-03">', 'Срок возврата: 10 рабочих дней после сверки (п. 5.6) ' + NEW('Сейчас возврат остатка в системе не отслеживается совсем: нет суммы, даты и статуса. Предложение.'), 'rbE'),
  bind: r => $('#rb', r).addEventListener('input', () => { $('#rbE', r).hidden = true; }),
  go: r => { const v = $('#rb', r).value.trim(); if (v === '') return fe('rbE', 'Укажите номер документа.', r); st.rdoc = v; return true; },
  primary: () => 'Вернуть партнёру ' + usd(restAll()), toast: 'Остаток возвращён. Путь пройден.',
  after: ['Остаток по заказу станет нулём (резерв остаётся на хвосты)', 'Партнёр увидит возврат', 'Путь партнёра завершён'] }] });

fr({ id: 'done', ls: 9, now: '02.12.2026 12:05', ev: 'Всё закрыто. Заказ в архиве, выплаты проведены, остаток возвращён. Следующих действий нет.', pev: 'Всё закрыто.', done: true, tasks: [] });
const LAST = F.length - 1;
const takenAll = () => st.budget * (reached('cn2') ? 2 : 1);
const spentAll = () => st.spent + (reached('cn2') ? novSpent() : 0);
const restAll = () => takenAll() - spentAll() - reserveOf() + st.refund;

/* ---------- Подсказки, тосты, подтверждения ---------- */
function toast(m, kind) { if (window.hbToast) window.hbToast(m, kind || 'ok'); }
function copy(t) { try { if (navigator.clipboard) navigator.clipboard.writeText(t).catch(function () {}); } catch (e) { /* буфер закрыт: в макете не страшно */ } }
function fe(id, msg, r) { const e = $('#' + id, r) || $('#' + id); const t = $('.notice__t', e) || $('span', e); t.textContent = msg; e.hidden = false; e.scrollIntoView({ block: 'nearest' }); return false; }
/* Галка договора без отметки: красная галка по киту (.check.is-err, aria-invalid) и плашка над кнопкой, как в коде (TermsBlock, OrderForm). Фокус на галку, чтобы ошибку нельзя было не заметить. */
const accErr = (r, msg) => { const a = $('#acc', r); a.setAttribute('aria-invalid', 'true'); a.closest('.check').classList.add('is-err'); a.focus(); return fe('ordE', msg, r); };
const accClear = r => { const a = $('#acc', r); a.removeAttribute('aria-invalid'); a.closest('.check').classList.remove('is-err'); $('#ordE', r).hidden = true; };
/* Окно подтверждения. Безопасный вариант - главная кнопка СПРАВА с фокусом по умолчанию, опасное действие - обычная кнопка слева
   с прямым текстом результата. Для подтверждения факта (a.confirm) наоборот: подтвердить справа, отмена слева. */
let mCb = null, mAct = null, mOpt = false;
function ask(a, cb) {
  const L = $('#cf-l'), R = $('#cf-b'), conf = !!a.confirm;
  $('#cf-h').textContent = a.title; $('#cf-t').textContent = a.text;
  mOpt = a.reason === 'opt'; $('#cf-rf').hidden = !a.reason; $('#cf-r').value = ''; $('#cf-e').hidden = true;
  $('#cf-rf label').innerHTML = 'Причина ' + (mOpt ? '<span class="note">(по желанию)</span>' : '<span class="field__req" aria-hidden="true">*</span>');
  L.textContent = conf ? (a.keep || 'Нет, вернуться') : a.ok; R.textContent = conf ? a.ok : (a.keep || 'Нет, вернуться');
  mAct = conf ? ['close', 'do'] : ['do', 'close']; mCb = cb; $('#cf').showModal(); R.focus();
}
function setupModal() {
  const act = k => {
    if (k === 'do') {
      if (!$('#cf-rf').hidden && !mOpt && $('#cf-r').value.trim() === '') { $('#cf-e').hidden = false; return; }
      const c = mCb, why = $('#cf-r').value.trim(); mCb = null; $('#cf').close(); if (c) c(why); return;
    }
    mCb = null; $('#cf').close();
  };
  $('#cf-l').addEventListener('click', () => act(mAct[0])); $('#cf-b').addEventListener('click', () => act(mAct[1]));
}

/* ---------- Часы сценария и задачи ---------- */
const nowMs = () => parseNow(F[st.f].now) + st.adj;
const blocking = t => !t.optional && !t.until;
function openTasks(role) {
  if (st.halt) return haltTasks(role);
  const out = [];
  F.forEach((fr_, i) => (fr_.tasks || []).forEach(t => {
    if (role && t.role !== role) return;
    if (t.cond && !t.cond()) return;
    if (st.did[t.id]) return;
    if (st.f >= (t.since ? ix[t.since] : i) && st.f <= (t.until ? ix[t.until] : i)) out.push(t);
  }));
  return out.concat(stopTasks(role), alertTasks(role));
}
function taskById(id) {
  for (const fr_ of F) for (const t of (fr_.tasks || [])) if (t.id === id) return t;
  return stopTasks(null).concat(alertTasks(null), [HALT_REFUND, HALT_AGAIN]).find(t => t.id === id) || null;
}
const dueOf = t => { const d = val(t.due); return d || null; };
function sortTasks(ts) { return ts.slice().sort((a, b) => { const x = dueOf(a), y = dueOf(b); return x && y ? x.due - y.due : x ? -1 : y ? 1 : 0; }); }
/* Кадр «Партнёр принимает условия» нужен, только когда заказ создал отдел: заказ партнёра подписан галкой при оформлении, и после подтверждения сразу идёт счёт (в коде тоже нет промежутка без задачи). */
const skipped = i => !!(F[i] && F[i].skip && F[i].skip());
function setF(i, keepHalt) {
  const prev = st.f; let n = Math.max(0, Math.min(LAST, i));
  while (skipped(n) && n > 0 && n < LAST) n += n >= prev ? 1 : -1;
  st.f = n; if (n !== prev) st.fbPart = 0; if (st.f <= ix.dsp) st.nodsp = false;
  if (st.f < prev) F.forEach((fr_, k) => { if (k >= st.f) (fr_.tasks || []).forEach(t => { delete st.did[t.id]; }); });
  if (!keepHalt) { st.halt = null; delete st.did['halt.refund']; }
  render(); writeHash();
}
const advance = () => setF(st.f + 1);
function runTask(t, host, kind) {
  const d = kind === 'danger' ? t.danger : t;
  const exec = why => {
    if (d.fx) d.fx();
    st.did[t.id] = kind;
    if (d.toast) toast(val(d.toast), kind === 'danger' ? 'warn' : 'ok');
    if (d.halt) { st.halt = { key: d.halt, by: d.by, why: why || '', tid: t.id, at: nowMs() }; render(); writeHash(); return; }
    if (d.back) { setF(ix[d.back]); return; }
    if (d.jump) { setF(ix[d.jump]); return; }
    if (kind === 'primary' ? (t.advance || (blocking(t) && !t.stay)) : (d.complete || (blocking(t) && !d.stay))) setF(st.f + 1); else render();
  };
  if (kind === 'primary') { if (t.go && t.go(host) === false) return; if (t.confirm) return ask(t.confirm, exec); exec(); } else ask(d.ask, exec);
}
/* Отказ в окне 24 часа. В коде refusePayment закрывает ЗАКАЗ, а не допуск партнёра: допуск остаётся открытым. Дальше финансисту ставится задача refund-due «Вернуть партнёру» (10 рабочих дней, п. 5.2 и 5.6), а партнёр может оформить новый заказ (order.place). Задача финансиста не двигает кадр: путь остановлен, возврат только фиксируется. */
const haltDue = () => { const a = st.halt && st.halt.at ? st.halt.at : nowMs(), d = endBD(a, 10); return { due: d, span: d - a, rule: 'п. 5.2 и 5.6 договора: возврат в течение 10 рабочих дней после отказа (как у возврата остатка)' }; };
const HALT_REFUND = { id: 'halt.refund', key: 'refund', role: 'fin', lane: 'launch', stay: true,
  short: () => 'Вернуть партнёру ' + usd(st.budget), due: haltDue,
  title: () => 'Партнёр отказался от заказа. Верните ему ' + usd(st.budget) + ' тем же способом, которым он платил, и впишите номер банковского документа.',
  form: () => facts([['Сумма', usd(st.budget)], ['Платёж', 'TP-2010-001 за октябрь'], ['Вернуть до', dtShort(haltDue().due)]]) +
    field('hd', 'Номер банковского документа', '<input class="input" id="hd" autocomplete="off" placeholder="например BD-20261019-05">', 'Срок возврата: 10 рабочих дней после отказа (п. 5.6) ' + NEW('Сейчас кнопка «Возврат выполнен» номера документа не просит. Предложение: номер и дата, как у возврата остатка.'), 'hdE'),
  bind: r => $('#hd', r).addEventListener('input', () => { $('#hdE', r).hidden = true; }),
  go: r => { const v = $('#hd', r).value.trim(); if (v === '') return fe('hdE', 'Укажите номер документа: без него возврат не отмечается выполненным.', r); st.halt.rdoc = v; st.halt.rat = nowMs(); return true; },
  primary: () => 'Вернуть партнёру ' + usd(st.budget), toast: 'Возврат записан. Партнёр видит: деньги возвращены.',
  after: ['Платёж получит статус «Возвращён»', 'Партнёр увидит «Деньги возвращены» с датой', 'Путь по этому заказу завершён; новый заказ партнёр оформит сам'] };
const HALT_AGAIN = { id: 'halt.again', key: 'again', role: 'partner', lane: 'launch', jump: 'adm', due: null,
  short: 'Оформить новый заказ', title: 'Деньги вам вернули. Если захотите продолжить, оформите новый заказ: допуск у вас остаётся открытым.',
  primary: 'Оформить новый заказ', toast: 'Начинаем новый заказ (в макете путь идёт с оформления заказа).',
  after: ['Откроется оформление заказа: рынок, бюджет, условия', 'Прежний заказ остаётся в «Закрытых заказах» с отказом'] };
function haltTasks(role) {
  if (!st.halt || st.halt.key !== 'refuse') return [];
  const out = st.did['halt.refund'] ? [HALT_AGAIN] : [HALT_REFUND];
  return role ? out.filter(t => t.role === role) : out;
}

/* ---------- Остановка расходов по требованию партнёра (п. 5.3): тревога у всех ролей ---------- */
const stopOpen = () => st.stops.find(s => !s.done);
const stopLast = () => st.stops[st.stops.length - 1];
const stopAllowed = () => st.f >= ix.meta && st.f < ix.cls && !st.halt;
/* Остановка: система ставит кампанию на паузу в Meta сразу; не прошло - красная задача маркетингу и срок п. 5.3 */
function addStop(who) { const tm = stopTerms(nowMs()), fail = !!st.pauseFail; st.stops.push({ who: who, req: tm.req, recv: tm.recv, due: tm.due, done: !fail, doneMs: fail ? 0 : tm.req, fail: fail, auto: !fail, ts: Date.now() }); }
const stopLeft = s => Math.max(0, Math.floor((s.due - nowMs()) / 1000));
const dtx = ms => dt(shiftT(ms, nowMs()));
const stopRule = 'п. 5.3 договора: отключить в течение 1 рабочего дня; требование после 18:00 считается полученным в 09:00 следующего рабочего дня';
const stopB = s => '<b data-left="' + shiftT(s.due, nowMs()) + '" data-n0="' + (CTX.list === null ? nowMs() : CTX.list) + '">' + (stopLeft(s) ? fmtLeft(stopLeft(s)) : 'срок вышел') + '</b>';
function stopTasks(role) {
  const s = stopOpen(); if (!s) return [];
  const i = st.stops.indexOf(s), why = 'Meta ответила: доступ к рекламному кабинету отклонён, токен просрочен (пример ответа).';
  const out = [{ id: 'stop.' + i, key: 'stop', fid: 'stop', role: 'mkt', lane: 'ads', stay: true, short: () => 'Кампания ' + campShort() + ': пауза в Meta не прошла, остановите кампанию вручную',
    due: () => ({ due: s.due, span: s.due - s.recv, rule: stopRule }),
    title: () => 'Партнёр потребовал остановить расходы, а пауза в Meta не прошла. Кампания ' + campShort() + ': остановите кампанию вручную в рекламном кабинете Meta и подтвердите.',
    form: () => '<p class="note">Система сразу пыталась поставить кампанию на паузу, Meta ответила отказом. Причину видит полный админ.</p>',
    primary: 'Реклама отключена', toast: 'Отмечено: реклама отключена, партнёр это увидит.',
    confirm: { confirm: true, title: 'Реклама отключена в Meta?', text: 'Подтвердите, что кампания на паузе. Партнёр увидит время отключения.', ok: 'Да, реклама отключена', keep: 'Нет, ещё не отключена' },
    fx: () => { s.done = true; s.doneMs = Math.min(s.due, s.recv + 45 * 60000); s.auto = false; },
    after: ['Тревога у всех снимется, полоса станет серой', 'Партнёр увидит «Реклама остановлена» со временем', 'В журнал запишется, кто и когда отключил'] },
  { id: 'stopwhy.' + i, key: 'stopwhy', fid: 'stop', role: 'admin', lane: 'ads', short: () => 'Кампания ' + campShort() + ': пауза в Meta не прошла, причина', optional: true,
    due: () => ({ due: s.due, span: s.due - s.recv, rule: stopRule }),
    title: () => 'Пауза кампании ' + campShort() + ' в Meta не прошла. ' + why + ' Маркетингу поставлена задача остановить кампанию вручную.',
    primary: null }];
  return role ? out.filter(t => t.role === role) : out;
}
function alarmStrip(pname, pid, s, i, link) {
  const r = st.role, mine = r === 'mkt', nudge = r === 'dept' || r === 'admin';
  if (s.done) return '<div class="notice alarm alarm--done" role="status">' + ic('circle-check') + '<div><p class="notice__t">Реклама «' + esc(pname) + '» остановлена ' + dtx(s.doneMs) + '</p><p class="note">' + (s.auto ? 'Требование получено ' + dtx(s.recv) + ', кампания поставлена на паузу в Meta системой сразу.' : 'Требование получено ' + dtx(s.recv) + ', пауза в Meta не прошла, маркетинг отключил кампанию вручную в срок (до ' + dtx(s.due) + ').') + '</p></div></div>';
  return '<div class="notice notice--err alarm" role="alert">' + ic('siren') + '<div class="stack"><p class="notice__t">Партнёр «' + esc(pname) + '» требует остановить расходы</p>' +
    '<p>Требование получено <b>' + dtx(s.recv) + '</b> (Дубай). ' + (s.fail ? 'Пауза в Meta не прошла. ' : '') + 'Отключить рекламу вручную до <b>' + dtx(s.due) + '</b> (' + stopRule.split(';')[0] + '). ' + (mine ? 'Осталось: ' : 'Ждём отключения: маркетинг, осталось ') + stopB(s) + '</p>' +
    ((nudge || link) ? '<div class="contact">' + (nudge ? '<button class="btn btn--s" type="button" data-nudge="mkt">Напомнить маркетингу</button>' : '') + (link ? '<button class="btn btn--s" type="button" data-open="' + pid + '">Открыть карточку</button>' : '') + '</div>' : '') + '</div></div>';
}

/* Красные задачи маркетингу от сторожа Meta (раз в час): снят лимит, лимит больше оплаченного, кампания крутится у остановленного заказа, кабинет не в долларах. Только у живого партнёра, выбор в демо-панели. */
const ALERTS = {
  cap_removed: 'у кампании в Meta снят лимит трат: верните лимит',
  cap_over_paid: 'лимит кампании в Meta больше оплаченного партнёром: сверьте платежи и снизьте лимит',
  active_while_stopped: 'кампания в Meta включена, а заказ остановлен или закрыт: отключите её',
  account_not_usd: 'рекламный кабинет Meta не в долларах: лимиты и расход неверны, проверьте кабинет'
};
function alertTasks(role) {
  if (!st.alert || !ALERTS[st.alert] || (role && role !== 'mkt') || st.halt || st.f < ix.fnd || ctxPid() !== st.pid) return [];
  const txt = () => 'Кампания ' + campShort() + ': ' + ALERTS[st.alert];
  return [{ id: 'alert.' + st.alert, key: 'alert', fid: 'alert', role: 'mkt', lane: 'ads', short: () => B('err', 'тревога') + ' ' + txt(), due: null, title: txt,
    form: () => '<p class="note">Что делает маркетинг: исправляет причину в рекламном кабинете Meta (кнопки в нашей системе нет, она ничего не правит в Meta). Сторож проверяет кампании раз в час и снимет задачу сам, когда при очередной сверке неполадки не будет.</p><div class="contact"><button class="btn btn--s" type="button" id="alGone">Прошёл час: сторож перепроверил, неполадки нет (только макет)</button></div>',
    bind: r => { $('#alGone', r).onclick = () => { st.alert = ''; render(); toast('Сторож перепроверил кампанию: неполадки нет, задача снялась сама', 'ok'); }; }, primary: null }];
}

/* ---------- Оболочка: меню админки и кабинета, разметка как в приложении ---------- */
const nav = (icon, label, cur, badge) => '<li><a href="#" aria-current="' + (cur ? 'page' : 'false') + '">' + ic(icon) + '<span>' + label + '</span>' + (badge ? '<span class="badge badge--n">' + badge + '</span>' : '') + '</a></li>';
const group = (id, title, items) => '<div>' + (title ? '<p class="knav__t" id="kn-' + id + '">' + title + '</p>' : '') + '<ul' + (title ? ' aria-labelledby="kn-' + id + '"' : '') + '>' + items.map(i => nav(i[0], i[1], i[2], i[3])).join('') + '</ul></div>';
const adminNav = cnt =>
  group('o', '', [['layout-dashboard', 'Обзор'], ['chart-column', 'Отчёты'], ['users', 'Клиенты'], ['scan-search', 'Что ищут на сайте'], ['globe', 'Веб-аналитика']]) +
  group('t', 'Команда и допуск', [['briefcase', 'Локальные партнёры'], ['user-check', 'Набор партнёров'], ['file-pen-line', 'Условия по странам'], ['book-open-check', 'Правила страны'], ['route', 'Распределение клиентов'], ['messages-square', 'Переписки без хозяина'], ['life-buoy', 'Требуется помощь'], ['inbox', 'Переписки'], ['message-square-reply', 'Сообщения агентов', false, '1'], ['id-card', 'Досье клиента'], ['user-cog', 'Сотрудники и роли'], ['handshake', 'Агенты и рефералка'], ['user-x', 'Регистрации без карточки'], ['folder-heart', 'Подборки']]) +
  group('c', 'Каталог', [['building', 'Проекты'], ['trending-up', 'Рынки'], ['tags', 'Цены и прайсы'], ['factory', 'Застройщики'], ['rss', 'Приём фида']]) +
  group('m', 'Деньги', [['receipt', 'Поступления комиссии'], ['layers', 'Выплатные партии'], ['gavel', 'Споры о доле'], ['check-check', 'Одобрение выплат'], ['target', 'Медиапартнёры', true, cnt ? String(cnt) : ''], ['coins', 'Курсы валют']]) +
  group('p', 'Продвижение', [['rss', 'Сайт и статьи'], ['film', 'Видео партнёров и агентов'], ['sparkles', 'Маркетинговые заявки'], ['megaphone', 'Рассылки']]) +
  group('s', 'Система', [['settings', 'Настройки'], ['timer', 'Рабочее время'], ['plug', 'Интеграции'], ['siren', 'Технические тревоги'], ['message-square-plus', 'Обратная связь'], ['circle-user', 'Мой аккаунт']]);
const PARTNER_NAV =
  group('w', 'Мой кабинет', [['layout-dashboard', 'Сводка'], ['users', 'Мои клиенты'], ['wallet', 'Мои деньги'], ['share', 'Мои рефералы'], ['link-2', 'Моя ссылка'], ['users-round', 'Моя команда'], ['target', 'Медиапартнёр', true], ['message-square', 'Сообщения']]) +
  group('i', 'Инструменты', [['library', 'Каталог и цены'], ['folder-heart', 'Мои подборки'], ['film', 'Генератор контента'], ['percent', 'Комиссия'], ['webhook', 'API: передача клиентов']]) +
  group('f', 'Профиль', [['building-2', 'Профиль и реквизиты'], ['shield-check', 'Согласия'], ['scroll-text', 'Регламент'], ['message-square-plus', 'Обратная связь'], ['megaphone', 'Наши обновления']]);

/* Все партнёры со снимками состояния: текущий берётся живьём, остальные из памяти вкладки */
const snapOf = p => (p.id === st.pid ? takeSnap() : (st.store[p.id] || (st.store[p.id] = p.sn())));
const eachP = fn => PARTNERS.map(p => { const sn = snapOf(p); CTX.pid = p.id; try { return withSnap(sn, () => fn(p, sn)); } finally { CTX.pid = null; } });
const stopCount = () => eachP(() => (stopOpen() ? 1 : 0)).reduce((a, b) => a + b, 0);

function shell(page) {
  const adm = st.mode !== 'partner';
  const me = adm ? '<span class="avatar avatar--s" aria-hidden="true">А</span><span><b>Администратор</b></span>' : '<span class="avatar avatar--s" aria-hidden="true">МП</span><span><b>МП Агент</b><small>Агент</small></span>';
  const bell = '<button type="button" class="btn btn--icon btn--quiet btn--round" aria-haspopup="dialog" aria-label="Уведомления, 9+">' + ic('bell') + '<span class="badge badge--n" aria-hidden="true">9+</span></button>';
  const cnt = adm ? stopCount() : 0;
  const bar = adm ? [['layout-dashboard', 'Обзор'], ['users', 'Клиенты'], ['target', 'Медиа', 1], ['receipt', 'Деньги']] : [['layout-dashboard', 'Сводка'], ['users', 'Клиенты'], ['target', 'Медиа', 1], ['wallet', 'Деньги']];
  return '<div class="kab' + (st.rail ? ' kab--rail' : '') + '" id="kab"><aside class="kab__side" id="k-side" aria-label="Меню"><div class="kab__head"><a class="brand" href="#" aria-label="Housebook"><svg viewBox="0 0 300 45" aria-hidden="true"><use href="#hb-logo"/></svg></a>' + bell +
    '<button type="button" class="btn btn--icon btn--quiet btn--round" id="rail" aria-controls="k-side" aria-expanded="' + !st.rail + '" aria-label="' + (st.rail ? 'Развернуть меню' : 'Свернуть меню') + '">' + ic(st.rail ? 'panel-left-open' : 'panel-left-close') + '</button></div>' +
    '<div class="kab__me">' + me + '</div><nav class="knav" aria-label="Разделы">' + (adm ? adminNav(cnt) : PARTNER_NAV) + '</nav>' +
    '<div class="kab__foot"><button type="button" class="btn btn--s btn--quiet">' + ic('book-open') + '<span>Спутник</span></button><p class="note">' + (adm ? 'admin@example.invalid' : 'mp.partner@example.invalid') + '</p><div class="kab__row"><button type="button" class="btn btn--s btn--quiet">' + ic('log-out') + '<span>Выйти</span></button></div></div></aside>' +
    '<header class="kab__top"><div class="kab__me">' + me + '</div>' + bell + '</header><main class="kab__main"><div class="kab__page">' + page + '</div></main>' +
    '<nav class="kab__bar" aria-label="Разделы">' + bar.map(b => '<a href="#" aria-current="' + (b[2] ? 'page' : 'false') + '">' + ic(b[0]) + '<span>' + b[1] + '</span></a>').join('') + '</nav></div>';
}

/* ---------- Путь: «Запуск» (линейно), «Работа» (параллельные дорожки), «Закрытие» ---------- */
/* [первый кадр, последний кадр, подпись админки, подпись партнёра, подсказка админки, подсказка партнёра] */
const LSTEPS = [
  ['req', 'req', 'Заявка', 'Заявка', 'Партнёр оставил заявку.\nКто решает: партнёрский отдел.', 'Вы подали заявку.\nХод Housebook: решает, допустить ли вас.'],
  ['adm', 'adm', 'Допуск', 'Допуск открыт', 'Партнёру открыт раздел «Медиапартнёр». Он читает условия и оформляет заказ сам; отдел может оформить за него.', 'Вам открыт раздел «Медиапартнёр».\nВаш ход: прочитать условия и оформить заказ.'],
  ['ord', 'ctr', 'Заказ', 'Заказ', 'Отдел подтверждает заказ. Если заказ оформил партнёр, его галка и есть подпись; если отдел, партнёр принимает условия сам. В заказе указано, кто платит: физическое или юридическое лицо.', 'Housebook подтверждает ваш заказ.\nЕсли заказ оформил отдел, вы принимаете условия сами.'],
  ['inv', 'cnf', 'Счёт и оплата', 'Счёт и оплата', 'Финансист выставляет счёт, партнёр оплачивает Swift-переводом в долларах на банк в Дубае. Деньги пришли на счёт Housebook: финансист сверяет выписку банка и подтверждает поступление (задача открыта сразу, как только счёт выставлен). Реквизиты Housebook берутся из настроек; не заполнены - партнёр увидит «Реквизиты пришлёт менеджер».', 'Housebook выставляет счёт, вы оплачиваете Swift-переводом в долларах, Housebook подтверждает, что деньги пришли.\nВаш ход: оплатить.'],
  ['win', 'win', '24 часа на отказ', '24 часа на отказ', 'Сутки после зачисления партнёр вправе отказаться и вернуть деньги. Запуск откроется сам.', 'Сутки вы вправе отказаться и вернуть деньги.\nВаш ход: ничего или отказаться.'],
  ['go', 'go', 'Кампания создана', 'Кампания создана', 'Заказ запускается сам после 24 часов, система создаёт кампанию в Meta на паузе: название mp-{номер заказа}, лимит трат равен оплаченному, дневной бюджет равен бюджету, делённому на 30. Финансисту уходит задача перевести деньги на баланс Facebook, маркетингу - запустить кампанию.', 'Заказ запускается сам, Housebook создаёт кампанию.\nХод Housebook.'],
  ['fnd', 'fnd', 'Деньги на балансе Facebook', 'Деньги на рекламном счёте', 'Финансист переводит лимит кампании на баланс рекламного аккаунта Facebook своим способом и отмечает перевод. Пока переведён не весь лимит, кнопка «Кампания запущена» у маркетинга закрыта.', 'Housebook переводит деньги на рекламный счёт.\nХод Housebook.'],
  ['cmp', 'cmp', 'Реклама запущена', 'Реклама запущена', 'Маркетинг включает кампанию в рекламном кабинете Meta и нажимает «Кампания запущена».', 'Housebook запускает вашу рекламу.\nХод Housebook.']
];
const STAGE = { req: 'Заявка', adm: 'Допуск открыт', ord: 'Заказ оформляется', ctr: 'Заказ оформляется', inv: 'Счёт к выставлению', pay: 'Ждём оплату', cnf: 'Оплатил, ждём подтверждения', win: 'Окно отказа', go: 'Запуск', fnd: 'Запуск', cmp: 'Запуск', meta: 'Реклама идёт', cli: 'Реклама идёт', dsp: 'Реклама идёт', com: 'Реклама идёт', plan: 'Реклама идёт', apr: 'Реклама идёт', inv2: 'Реклама идёт', tr: 'Реклама идёт', cn2: 'Реклама идёт', cool2: 'Реклама идёт', cls: 'Закрытие', ref: 'Закрытие', done: 'Закрыт' };
const stageName = () => (st.halt ? 'Отказался от заказа' : STAGE[F[st.f].id]);
const launched = () => st.f >= ix.meta;
const dateOfNext = i => F[Math.min(F.length - 1, i + 1)].now.slice(0, 5);

function mchain(items) {
  let cur = items.findIndex(x => !x[1]);
  return '<ol class="mchain">' + items.map((x, i) => '<li class="' + (x[1] ? 'is-done' : i === cur ? 'is-cur' : 'is-todo') + '"' + (x[2] ? ' tabindex="0" data-tip="' + esc(x[2]) + '"' : '') + '>' + x[0] + '</li>').join('') + '</ol>';
}
function laneNeed(P, lane) {
  const ts = openTasks(null).filter(t => t.lane === lane && !t.optional && !t.fallback);
  if (P) { const n = ts.filter(t => t.role === 'partner').length; return n ? B('warn', 'нужно действие', 'Ваш ход: карточка «Что сделать сейчас» выше.') : ''; }
  if (st.role === 'admin') { const rs = Array.from(new Set(ts.map(t => RN[t.role]))); return rs.length ? B('warn', 'нужно действие: ' + rs.join(', '), 'Задачи этой дорожки лежат в очередях ролей.') : ''; }
  const n = ts.filter(t => t.role === st.role).length;
  return n ? B('warn', 'нужно действие' + (n > 1 ? ': ' + n : ''), 'Ваша задача по этой дорожке: карточка «Что сделать сейчас» выше.') : '';
}
/* Дорожка - сворачиваемая строка: имя, состояние, главный счётчик. Развёрнута только та, где есть ход этой роли. */
function laneBox(icon, name, who, state, counters, need, extra) {
  const sum = counters.length ? '<span class="pill">' + counters[0][0] + ' <b>' + counters[0][1] + '</b></span>' : '';
  return '<details class="lane lane--d' + (need ? ' lane--need' : '') + '"' + (need ? ' open' : '') + '><summary class="lane__sum"><span class="lane__id"><span class="avatar avatar--s" aria-hidden="true">' + ic(icon) + '</span><span><b>' + name + '</b><small>' + who + '</small></span></span><span class="lane__st">' + state + '</span>' + sum + '<span class="lane__a">' + need + '</span>' + ic('chevron-down', 'lane__chev') + '</summary>' +
    '<div class="lane__body">' + (counters.length > 1 ? '<div class="lane__n">' + counters.slice(1).map(c => '<span class="pill">' + c[0] + ' <b>' + c[1] + '</b></span>').join('') + '</div>' : '') + (extra ? '<div class="lane__x">' + extra + '</div>' : '') + '</div></details>';
}
/* Счётчики клиентов: общие для дорожки, списка и кабинета */
function clientNums() {
  const n = fromF('cli') ? taggedN() : 0, k = st.excp && fromF('cli') && !st.excpDone ? 1 : 0;
  const manual = st.excp && st.excpDone ? 1 : 0, disp = dispOn() && st.f <= ix.plan && !did('dsp.dispute') ? 1 : 0;
  return { n: n, self: n - (st.excp && fromF('cli') ? 1 : 0), wait: k, manual: manual, disp: disp, meta: fromF('cli') ? metaN() - taggedN() : 0 };
}
const DEALS = () => [
  { id: pd().dl, live: true },
  { id: pd().k4, live: false, st: 'Ждём комиссию от застройщика' },
  { id: pd().dp, live: false, st: dispOn() && st.f <= ix.plan && !did('dsp.dispute') ? 'Спор о доле: до решения не начисляем' : 'Ждём комиссию от застройщика' }
];
function dealChain(d) {
  if (!d.live) return '<li><b>' + d.id + '</b> ' + mchain([['комиссия пришла', 0], ['начислено', 0], ['запланировано', 0], ['одобрено', 0], ['выплачено', 0]]) + '<span class="note">' + d.st + '</span></li>';
  const c = reached('com') || atF('com') && did('com.record'), pl = reached('plan'), ap = reached('apr'), pd = reached('tr');
  return '<li><b>' + d.id + '</b> ' + mchain([['комиссия пришла', c, 'Застройщик заплатил комиссию.'], ['начислено', c, 'Награда ' + usd(st.reward) + ' посчитана системой: 30% чистой выручки.'], ['запланировано', pl, 'Выплату запланировал финансист.'], ['одобрено', ap, 'Одобрил другой человек с паролем.'], ['выплачено', pd, 'Перевод сделан, номер документа сохранён.']]) + '</li>';
}
/* Что видит роль: отдел не видит комиссии и выплаты, маркетинг видит только рекламу и следующий месяц. Остальные роли и партнёр видят все дорожки. */
const LANE_SEE = { dept: ['ads', 'clients', 'next'], mkt: ['ads', 'next'] };
function lanes(P) {
  const cn = clientNums(), s = stopOpen(), l = stopLast(), see = P ? null : LANE_SEE[st.role];
  /* Подписи состояний дословно из buildLanes (now-model.ts) и messages/ru.json (partners.media.lane): партнёру кодовые подписи, сотрудникам словесные; тон у сотрудника warn при ходе роли, иначе muted */
  const stB = (lane, txt, pTone, tip) => B(P ? pTone : (laneNeed(false, lane) ? 'warn' : 'muted'), txt, tip);
  const out = [], add = (k, html) => { if (!see || see.indexOf(k) >= 0) out.push(html); };
  const adsSt = s ? B('err', 'Остановка запрошена', 'Партнёр потребовал остановить расходы. Срок отключения в красной полосе.') : l && l.done ? stB('ads', 'Реклама остановлена', 'muted') : reached('cls') ? stB('ads', 'Заказ закрыт', 'muted') : stB('ads', 'Реклама идёт', 'ok');
  add('ads', laneBox('megaphone', 'Реклама', P ? 'Housebook запускает и ведёт' : 'Маркетинг', adsSt, [], laneNeed(P, 'ads'), ''));
  const rep = fromF('cli') ? (P ? '<p class="note">Отчёт за октябрь получен в кабинете 02.11.2026. Замечания можно прислать в течение 15 рабочих дней (п. 8.3).</p>' : '<p class="note">' + NEW('Сегодня отчёт за месяц в системе не отслеживается. Предложение: система собирает отчёт и отправляет партнёру сама.') + ' Отчёт за октябрь собран и отправлен партнёру сам 02.11.2026, 09:00 (срок п. 8.1: 10 рабочих дней). Партнёр может прислать замечания до ' + fmtD(new Date(addBD(parseNow('02.11.2026 09:00'), 15))) + ': тогда у отдела появится задача ответить.</p>') : '';
  const clSt = P ? (cn.disp ? stB('clients', 'Заявка на проверке', 'warn') : cn.n === 0 ? stB('clients', 'Ждём первых заявок', 'muted') : stB('clients', 'Клиенты привязываются сами', 'ok')) : stB('clients', cn.disp ? 'Есть споры' : 'Идут обращения', 'muted');
  add('clients', laneBox('users', P ? 'Ваши клиенты' : 'Клиенты', P ? 'Housebook привязывает' : 'Партнёрский отдел', clSt,
    (P ? [['Пришло', cn.n]] : [['Пришло', cn.n], ['Споры', cn.disp]]).filter(c => c[1] > 0), laneNeed(P, 'clients'), rep));
  const ds = DEALS().map(d => dealChain(d)).join('');
  const dc = reached('com') || atF('com') && did('com.record'), dPl = reached('plan'), dAp = reached('apr'), dPd = reached('tr');
  const dTr = dAp && !dPd ? 1 : 0, dWa = dPl && !dAp ? 1 : 0, dPay = dc && !dPl ? 1 : 0;
  const dlSt = dTr ? stB('deals', P ? 'Выплата ждёт перевода' : 'Ждёт перевода', 'warn') : dWa ? stB('deals', P ? 'Выплата ждёт одобрения' : 'Ждёт одобрения', 'warn') : dPay ? stB('deals', P ? 'Награда к выплате' : 'К выплате', 'warn') : stB('deals', P ? 'Ждём комиссию от застройщика' : 'Ждём комиссий', 'muted');
  add('deals', laneBox('wallet', P ? 'Начисления и выплаты' : 'Комиссии и выплаты', P ? 'Housebook записывает и платит' : 'Финансы и финансовый директор', dlSt,
    P ? [] : [['К выплате', dPay], ['Ждут одобрения', dWa], ['Ждут перевода', dTr], ['Выплачено', dPd ? 1 : 0]].filter(c => c[1] > 0), laneNeed(P, 'deals'), '<ul class="mchains">' + ds + '</ul>'));
  const nx = fromF('inv2'), nxPaid = st.f >= ix.cool2;
  const nxSt = !nx || nxPaid ? stB('next', P ? 'Счёт на следующий месяц в работе' : 'Счёт на ' + (nxPaid ? 'декабрь' : 'ноябрь') + ' 2026 не выставлен', 'warn') : stB('next', P ? 'Ждём оплату за следующий месяц' : 'Ждём оплату за ноябрь 2026', 'warn');
  add('next', laneBox('calendar', 'Следующий месяц', P ? 'Housebook и вы' : 'Финансы и партнёр', nxSt, [],
    laneNeed(P, 'next'), nx ? mchain([['счёт на ноябрь', 1], ['оплата', st.f >= ix.cn2], ['зачисление', st.f >= ix.cool2], ['24 часа', st.f >= ix.cool2 && F[st.f].id !== 'cool2' ? 1 : 0, 'Окно отказа за ноябрь'], ['лимит поднят', st.f >= ix.cool2 && fbDone() >= capNow() ? 1 : 0, 'Система поднимает лимит кампании сама, финансист переводит разницу на баланс Facebook.']]) : ''));
  return '<div class="lanes">' + out.join('') + '</div>';
}
function renderPath(P) {
  const halt = !!st.halt, la = launched(), done = st.f >= ix.cls;
  const cur = LSTEPS.findIndex(s => st.f <= ix[s[1]]);
  const info = halt ? (st.did['halt.refund'] ? 'заказ закрыт, деньги возвращены' : 'путь остановлен, ждём возврат') : done ? 'идёт закрытие' : la ? 'идёт работа по заказу' : 'запуск: шаг ' + (cur + 1) + ' из ' + LSTEPS.length + ', ' + LSTEPS[cur][P ? 3 : 2].replace(/^./, c => c.toLowerCase());
  const row = '<ol class="steps steps--chain steps--path' + (st.conn === 'arrow' ? ' steps--arrow' : '') + '" id="path">' + LSTEPS.map((s, i) => {
    const isDone = st.f > ix[s[1]], isCur = i === cur;
    const cls = isDone ? 'is-done' : halt && isCur ? 'is-err' : isCur ? '' : 'is-todo';
    return '<li class="step ' + cls + '"' + (isCur ? ' aria-current="step"' : '') + '><h3><button type="button" class="path__go" data-f="' + ix[s[0]] + '" data-tip="' + esc(s[P ? 5 : 4] + '\n\n(для демонстрации: нажмите, чтобы перейти к этому шагу)') + '">' + s[P ? 3 : 2] + '</button></h3><small>' + (isDone ? dateOfNext(ix[s[1]]) : isCur ? (halt ? 'СТОП' : 'СЕЙЧАС') : NB) + '</small></li>';
  }).join('') + '</ol>';
  const close = [['Закрыть заказ', st.f > ix.cls], ['Вернуть остаток', st.f > ix.ref], ['Готово', atF('done')]];
  const closeCur = close.findIndex(x => !x[1]);
  const closeRow = '<ol class="steps steps--chain steps--path steps--short' + (st.conn === 'arrow' ? ' steps--arrow' : '') + '">' + close.map((c, i) => '<li class="step ' + (c[1] ? 'is-done' : i === closeCur && done ? '' : 'is-todo') + '"' + (i === closeCur && done ? ' aria-current="step"' : '') + '><h3>' + (P && i === 0 ? 'Заказ закрывается' : c[0]) + '</h3><small>' + (c[1] ? dateOfNext(ix[['cls', 'ref', 'done'][i]]) : i === closeCur && done ? 'СЕЙЧАС' : NB) + '</small></li>').join('') + '</ol>';
  return '<section class="panel stack" aria-labelledby="h-path"><div class="sec__head sec__head--row"><h2 class="h4" id="h-path">' + (P ? 'Ваш путь' : 'Путь партнёра') + '</h2><span class="note">' + info + '</span></div>' +
    '<div class="phase"><p class="phase__t">Запуск</p>' + (la ? '<details class="disclose"><summary>Запуск пройден, ' + LSTEPS.length + ' из ' + LSTEPS.length + ' ' + ic('chevron-down') + '</summary>' + row + '</details>' : row) + '</div>' +
    '<div class="phase"><p class="phase__t">Работа' + (la ? ': дорожки идут параллельно' : '') + '</p>' + (la ? lanes(P) : '<p class="note">Откроется после запуска рекламы: реклама, клиенты, ' + (P ? 'начисления' : 'комиссии') + ' и выплаты, следующий месяц.</p>') + '</div>' +
    '<div class="phase"><p class="phase__t">Закрытие</p>' + (done ? closeRow : '<p class="note">Откроется, когда работа по заказу закончится: закрытие заказа и возврат остатка.</p>') + '</div></section>';
}

/* ---------- Что сделать сейчас: очередь задач роли ---------- */
const afterBlock = t => { const a = val(t.after) || []; return a.length ? '<details class="disclose"><summary>Что случится после нажатия ' + ic('chevron-down') + '</summary><ul class="stack">' + a.map(x => '<li>' + x + '</li>').join('') + '</ul></details>' : ''; };
function taskBody(t) {
  let h = (t.big ? '' : '<p class="lead">' + val(t.title) + '</p>') + (t.form ? val(t.form) : '');
  const acts = [];
  const lk = t.lock ? t.lock() : '';
  if (lk) h += '<div class="notice notice--warn" role="status">' + ic('lock') + '<p class="notice__t">' + lk + '</p></div>';
  if (t.primary !== null && t.primary !== undefined) acts.push('<button class="btn btn--acc" type="button" data-k="primary"' + (lk ? ' disabled' : '') + '>' + val(t.primary) + '</button>');
  if (t.danger) acts.push('<button class="btn btn--danger" type="button" data-k="danger">' + val(t.danger.label) + '</button>');
  if (acts.length) h += '<div class="contact">' + acts.join('') + '</div>' + (t.form && /blockE/.test(val(t.form)) ? '' : errBox('blockE'));
  return h + afterBlock(t);
}
function dueFor(t) {
  const d = dueOf(t);
  if (!d) return t.role === 'partner' || t.optional || t.fallback ? '' : B('muted', 'срок не задан', NODUE);
  return dueChip(d, nowMs());
}
function taskCard(t, open) {
  const big = t.big;
  const head = big ? '<span class="q__t"><b>' + val(t.title) + '</b></span>' : '<span class="q__t"><b>' + val(t.short) + '</b></span> ' + dueFor(t);
  return '<details class="disclose q' + (big ? ' q--big' : '') + '" data-task="' + t.id + '"' + (open ? ' open' : '') + '><summary>' + head + ic('chevron-down') + '</summary><div class="stack">' + taskBody(t) + '</div></details>';
}
function doneCard() {
  const rec = takenAll();
  return '<p class="lead">Всё закрыто. Заказ в архиве, выплаты проведены, остаток возвращён. Следующих действий нет.</p>' + facts([['Принято от партнёра', usd(rec)], ['Потрачено на рекламу', usd(spentAll())], ['Возвращено остатком', usd(restAll())], ['Награда партнёру', usd(st.reward)]]);
}
const ROLE_ORDER = ['dept', 'mkt', 'fin', 'cfo', 'partner'];
/* Чей сейчас ход: только названия ролей, без текста чужих задач и сумм */
function turnNames(ts) {
  const rs = Array.from(new Set(ts.filter(t => !t.optional && !t.fallback).map(t => t.role))).sort((a, b) => ROLE_ORDER.indexOf(a) - ROLE_ORDER.indexOf(b));
  const names = rs.map(r => (r === 'partner' ? 'Партнёр' : ROLES[r].name));
  if (F[st.f].sys) names.push(F[st.f].sys);
  return names;
}
const fbBlock = fb => (fb.length ? '<details class="disclose"><summary>Запасной вариант ' + ic('chevron-down') + '</summary><div class="stack">' + fb.map(t => taskCard(t, false)).join('') + '</div></details>' : '');
/* Путь остановлен отказом партнёра: чей ход и чем кончается. Финансист возвращает деньги, партнёр видит возврат и может оформить новый заказ; остальные роли видят, что делать нечего. */
function renderHalt(P) {
  const h = st.halt, role = P ? 'partner' : st.role, done = !!st.did['halt.refund'], dueS = dtShort(haltDue().due), sum = usd(st.budget);
  const who = h.by === 'partner' ? 'Партнёр отказался сам, кнопкой в своём кабинете' : 'Отказ записан вручную';
  const why = h.why ? ', причина: «' + esc(h.why) + '»' : '';
  const retTxt = done ? 'Возврат ' + sum + ' выполнен ' + dt(h.rat) + ', документ ' + esc(h.rdoc) + '.' : 'Возврат ' + sum + ' до ' + dueS + '.';
  const unhalt = P ? '' : '<div class="contact"><button class="btn" id="unhalt" type="button">Вернуть шаг (только макет)</button></div>';
  const sec = body => '<section class="panel now now--halt stack" id="nowHost">' + body + '</section>';
  const eye = (P ? 'Что сделать сейчас' : 'Путь остановлен');
  if (P) {
    const mine = haltTasks('partner');
    return sec('<div class="now__eye"><h2 class="h4">' + eye + '</h2>' + (done ? B('done', 'Деньги возвращены') : B('warn', 'Ждём возврат')) + '</div>' +
      '<p class="lead">' + (done ? 'Деньги возвращены ' + dt(h.rat) : 'Вы отказались от заказа') + '</p>' +
      '<p class="note">' + (done ? 'Платёж ' + sum + ' вернулся вам тем же способом, которым вы платили (документ ' + esc(h.rdoc) + '). Заказ закрыт, путь по нему завершён.' : 'Платёж ' + sum + ' возвращается вам тем же способом, которым вы платили. Housebook вернёт деньги до ' + dueS + ' (10 рабочих дней). Заказ не запустится. Новый заказ можно оформить, когда деньги вернутся.') + '</p>' +
      mine.map(t => taskCard(t, true)).join(''));
  }
  const lead = '<p class="lead">Партнёр отказался от заказа</p><p class="note">' + who + why + '. Заказ закрыт, допуск партнёра остаётся открытым. ' + retTxt + '</p>';
  const head = '<div class="now__eye"><h2 class="h4">' + eye + '</h2>' + (done ? B('done', 'возврат выполнен') : B('warn', 'ждём возврат')) + '</div>';
  if (role === 'admin') {
    const open = haltTasks(null);
    return sec(head + lead + (open.length ? tbl([['Роль'], ['Задача'], ['Срок']], open.map(t => ({ attr: '', cells: [B('muted', RNT[t.role]), val(t.short), dueFor(t)] }))) + '<p class="note">Администратор видит задачи всех ролей, но выполняют их сами роли.</p>' : '') + unhalt);
  }
  const mine = haltTasks(role);
  if (mine.length) return sec(head + lead + mine.map(t => taskCard(t, true)).join('') + unhalt);
  return sec(head + lead + '<p class="note">' + (done ? 'Ваших задач нет: путь по заказу завершён.' : 'Ваших задач нет. Деньги возвращает финансист.') + '</p>' + unhalt);
}
function renderQueue(P) {
  if (st.halt) return renderHalt(P);
  if (F[st.f].done) return '<section class="panel now now--done stack" id="nowHost"><div class="now__eye"><h2 class="h4">Что сделать сейчас</h2>' + B('done', 'Готово') + '</div>' + doneCard() + '</section>';
  const role = P ? 'partner' : st.role;
  const all = openTasks(null), live = all.filter(t => !t.fallback), nw = F[st.f].nw ? ' ' + NEW(F[st.f].nw) : '';
  const head = (cnt, cls) => '<div class="now__eye"><h2 class="h4">Что сделать сейчас</h2>' + B(cls || 'muted', cnt) + '</div>';
  if (role === 'admin') {
    const rows = sortTasks(live).map(t => ({ attr: '', cells: [B('muted', RNT[t.role]), val(t.short), dueFor(t)] }));
    return '<section class="panel now stack" id="nowHost">' + head('задач сейчас: ' + live.length, live.length ? 'warn' : 'muted') + (rows.length ? tbl([['Роль'], ['Задача'], ['Срок']], rows) + '<p class="note">Администратор видит задачи всех ролей, но выполняют их сами роли.</p>' : '<p>' + (F[st.f].wait || 'Открытых задач нет: идёт ожидание событий' + (F[st.f].sys ? ' (' + F[st.f].sys.toLowerCase() + ')' : '') + '.') + nw + '</p>') + '</section>';
  }
  const mine = sortTasks(live.filter(t => t.role === role)), others = sortTasks(live.filter(t => t.role !== role)), fb = all.filter(t => t.fallback && t.role === role);
  if (mine.length) {
    const ho = P ? hbTurn(others) : [];
    return '<section class="panel now stack" id="nowHost">' + head(mine.length === 1 ? '1 задача' : mine.length + ' ' + plural(mine.length, 'задача', 'задачи', 'задач'), 'ok') + mine.map((t, i) => taskCard(t, i === 0)).join('') +
      (ho.length ? '<p class="note">Параллельно ход Housebook: ' + ho.map(hbItem).join('; ') + '.</p>' : '') + fbBlock(fb) + '</section>';
  }
  if (P) {
    const hb = hbTurn(others);
    return '<section class="panel now now--theirs stack" id="nowHost">' + head('ход Housebook') + '<p class="lead">Сейчас у вас задач нет.</p>' + (hb.length ? '<ul class="stack">' + hb.map(x => '<li>Сейчас ход Housebook: ' + hbItem(x) + '</li>').join('') + '</ul>' : '<p>' + (F[st.f].pev || 'Сейчас ничего делать не нужно: мы работаем по заказу.') + '</p>') + '</section>';
  }
  const names = turnNames(all);
  return '<section class="panel now now--theirs stack" id="nowHost">' + head('задач нет') + '<p class="lead">' + (F[st.f].wait && !names.filter(n => n !== F[st.f].sys).length ? F[st.f].wait : names.length ? 'Сейчас ход: ' + names.join(', ') : 'Сейчас ничего делать не нужно: идёт ожидание событий.') + nw + '</p>' + fbBlock(fb) + '</section>';
}
/* Дела Housebook для партнёра (как turnByText в MediaPartnerNow): одинаковый текст один раз с ближайшим сроком, прошедший срок датой не показываем */
function hbTurn(ts) {
  const m = new Map(), n = nowMs();
  ts.forEach(t => { const text = val(t.pw); if (!text || t.optional) return; const d = dueOf(t), due = d && d.due >= n ? d.due : null, p = m.get(text); if (!p || (due !== null && (p.due === null || due < p.due))) m.set(text, { text: text, due: due }); });
  return Array.from(m.values());
}
const hbItem = x => x.text + (x.due === null ? '' : ', обычно до ' + dtShort(x.due));

const is = (...rs) => rs.indexOf(st.role) >= 0;
const disclose = (sum, body, open) => '<details class="disclose"' + (open ? ' open' : '') + '><summary>' + sum + ' ' + ic('chevron-down') + '</summary><div class="stack">' + body + '</div></details>';
const partnerOf = id => PARTNERS.find(p => p.id === id) || PARTNERS[0];
function closeReady() { return checks(['Выплата за октябрь проведена (документ ' + esc(st.bank || 'BD-…') + ')', 'Ноябрь отработан', 'К возврату партнёру ' + usd(restAll())]); }

/* ---------- Блок метрик по заказу: один в админке и в кабинете. Деньги здесь не повторяем: они живут в своём одном месте ---------- */
function metricsBlock(who) {
  const P = who === 'partner', live = fromF('meta');
  /* Партнёру: сверка кампании; админу сверка стоит выше, рядом с кампанией. Показы, клики и цена заявки в коде пока недоступны. */
  const sv = P ? watchLine(true) : '';
  const nope = P ? '' : '<div class="notice" role="status">' + ic('info') + '<div><p class="notice__t">Показы, клики и цена заявки пока недоступны</p><p>Раз в час система сверяет с Meta потраченное и остаток лимита, цифры у каждой кампании ниже. Показы, клики, охват и цену заявки подключим позже.</p></div></div>';
  if (!live) return sv + nope;
  const m = meta();
  const manual = st.manual ? '<p class="fresh fresh--stale">Расход периода внесён вручную маркетингом: сверка с Meta его не пишет.</p>' : '';
  const money = who === 'mkt' ? facts([['Потрачено', usd(st.spent)], ['Резерв на хвосты', usd(reserveOf())], ['Остаток партнёра', usd(restOf())]]) : '';
  const chart = (title, data, unit) => {
    const mx = Math.max.apply(null, data);
    return '<div class="stack"><h3 class="h4">' + title + '</h3><div class="chart"><div class="chart__cols">' + data.map((v, i) => '<div class="chart__c' + (v === mx ? ' is-max' : '') + '" tabindex="0" data-tip="' + DAYS[i] + ' октября&#10;' + v + unit + '" style="--hb-h:' + (v / mx * 100).toFixed(1) + '"><b>' + v + '</b><i></i><span>' + DAYS[i] + '</span></div>').join('') + '</div></div></div>';
  };
  const ads = tbl([['Объявление'], ['Расход', 1], ['Показы', 1], ['Клики', 1], ['CTR', 1], ['Заявки Meta', 1]], m.rows.map(r => ['<div class="contact"><span class="avatar avatar--s" aria-hidden="true">' + ic('image') + '</span><span>' + r.n + '</span></div>', usd(r.sp), nf(r.im), nf(r.cl), (r.cl / r.im * 100).toFixed(1).replace('.', ',') + NB + '%', r.ld]));
  const detail = facts([['Показы', nf(m.impr)], ['Охват', nf(m.reach)], ['Клики', nf(m.clicks)], ['CTR', m.ctr + NB + '%'], ['Цена клика', m.cpc + NB + '$'], ['Цена 1000 показов', m.cpm + NB + '$']]) +
    facts([['Заявки по данным Meta', m.leads], ['Обращения в нашей системе', m.inq], ['Стоимость обращения', usd(m.cpi)]]) +
    '<div class="hb-grid hb-grid--2">' + chart('Расход по дням, $', m.sd, ' $') + chart('Клики по дням', m.cd, ' кликов') + '</div>' +
    (P ? '' : disclose('На что потрачено: по объявлениям', ads + '<p class="note">Из Meta по каждому объявлению кампании. Сумма строк равна общему расходу.</p>'));
  return sv + manual + money + nope + disclose('Показы, клики и график ' + NEW('Предложение: показы, клики, охват, цена заявки и график по дням. Сейчас в системе их нет, цифры ниже условные.'), detail);
}

/* ---------- Секции админки. Скрыты, пока показывать нечего: экран не растягиваем ---------- */
function headAdmin() {
  const p = partnerOf(st.pid), rid = 'mpt_' + p.id;
  const access = st.halt ? 'Открыт, заказа нет' : st.f >= ix.done ? 'Открыт, заказ закрыт' : fromF('meta') ? 'Работает' : fromF('ord') ? 'Есть заказ' : 'Приглашён';
  return '<section class="phead phead--kab" aria-labelledby="pt"><div class="wrap"><div class="phead__row"><div class="phead__main"><h1 id="pt">' + esc(p.name) + '</h1><p class="note">' + (p.origin === 'С сайта' ? 'Посторонний' : 'Из агентов') + ', допуск: ' + access + '</p>' +
    '<p class="contact"><span class="note">ID:</span><code>' + rid + '</code><button type="button" class="btn btn--icon btn--s btn--quiet" data-copyid="' + rid + '" aria-label="Скопировать ID ' + rid + '">' + ic('copy', 'ic--16') + '</button><span class="note" role="status" aria-live="polite"></span></p></div>' +
    '<div class="phead__acts"><button type="button" class="btn">' + ic('refresh') + 'Обновить</button></div></div><a class="more more--s" href="#" data-list>' + ic('chevron-left', 'ic--16') + 'К списку медиапартнёров</a></div></section>';
}
/* «Допуск и лимит» как в живом коде (AccessTab): отметка «первый цикл завершён», потом повышение лимита; форма видна, только когда доступна */
function secAccess() {
  const cl = st.f > ix.cnf, ac = cl ? takenAll() : 0, cyc = !!did('acc.cycle'), lim = st.did['acc.limit'] || 4000, can = is('fin', 'admin');
  let b = facts([['Допуск', fromF('meta') ? 'Работает' : fromF('ord') ? 'Есть заказ' : 'Приглашён'], ['Первый цикл', cyc ? 'завершён' : 'идёт'], ['Лимит бюджета', usd(lim) + ', остаток ' + usd(lim - ac)]]);
  if (!can) b += '<p class="note">Отметку цикла и лимит меняют финансовый отдел и полный админ; этой роли доступно чтение.</p>';
  else if (!cyc) b += '<div class="panel stack"><h3 class="h4">Первый цикл завершён</h3><p class="note">Отметка не снимает лимит, она открывает его повышение.</p>' + field('fcAt', 'Когда завершён', '<input class="input" type="datetime-local" id="fcAt">', 'Время по Дубаю; пусто - сейчас.') + '<div><button class="btn btn--acc" type="button" id="fcBtn">Отметить цикл завершённым</button></div></div>';
  else b += '<div class="panel stack"><h3 class="h4">Повысить лимит</h3><div class="hb-grid hb-grid--2">' + field('lmV', 'Новый лимит, $', '<input class="input" id="lmV" inputmode="decimal">', 'Сейчас ' + usd(lim) + '; только вверх.') + field('lmAt', 'Партнёра уведомили', '<input class="input" type="datetime-local" id="lmAt">', 'Время по Дубаю, не в будущем.') + '</div>' + errBox('lmE') + '<div><button class="btn btn--acc" type="button" id="lmBtn">Повысить лимит</button></div></div>';
  return secWrap('access', 'Допуск и лимит', b);
}
/* Статусы платежей: партнёру «Ожидается / Зачислен / 24 часа на отказ», сотрудникам подробнее */
const payRows = P => {
  const win = 'Первые 24 часа после зачисления платёж можно вернуть, отказавшись от заказа (п. 5.1 договора).\nПо окончании окна реклама запустится сама.';
  const oct = st.halt ? (st.did['halt.refund'] ? B('muted', 'Возвращён', 'Партнёр отказался в окне 24 часа, деньги возвращены.') : B('warn', 'Отказ, возврат ждёт', 'Партнёр отказался в окне 24 часа. Финансист возвращает деньги в течение 10 рабочих дней (п. 5.6).')) : st.f <= ix.pay ? (P ? B('muted', 'Ожидается', 'Деньги ещё не зачислены: зачисление подтверждает финансовый отдел Housebook.') : atF('pay') ? B('warn', 'Ждём оплату, поступление подтверждает финансист') : B('muted', 'Ждём оплату')) : atF('win') ? (P ? B('warn', '24 часа на отказ', win) : B('warn', 'Можно отказаться до 20.10, 14:20', win)) : B('ok', 'Зачислен');
  const rows = [['2026-10', 'TP-2010-001', usd(st.budget), oct, '15.10.2026']];
  if (fromF('inv2')) rows.push(['2026-11', 'TP-2011-001', usd(st.budget), st.f <= ix.tr && !did('tr.confirm2') ? (P ? B('muted', 'Ожидается') : B('muted', 'Ждём оплату')) : atF('cn2') ? (P ? B('muted', 'Ожидается', 'Деньги ещё не зачислены: зачисление подтверждает финансовый отдел Housebook.') : B('warn', 'Деньги ждут подтверждения')) : st.f < ix.cool2 ? (P ? B('warn', '24 часа на отказ', win.replace('реклама запустится сама', 'ноябрь запустится сам')) : B('warn', 'Можно отказаться до 18.11, 10:00', win.replace('реклама запустится сама', 'ноябрь запустится сам'))) : B('ok', 'Зачислен'), '14.11.2026']);
  return rows;
};
function secOrder() {
  const money = is('fin', 'cfo');
  if (!fromF('ord')) return '';
  let b = '<div class="tbar"><h3 class="h4">' + orderName() + '</h3><span class="note" tabindex="0" data-tip="Полный номер заказа: ' + orderId() + '\nОн нужен для метки рекламы, система подставит его сама.">заказ …' + sfx() + '</span></div>' +
    kv([['Страны', MK[st.market].terr.join(', ')], ['Кто платит', PAYER[st.payer]], ['Оформил', st.orderBy === 'partner' ? 'партнёр сам, с принятием условий (подпись)' : 'партнёрский отдел за партнёра'], ['Договор', fromF('inv') ? 'HB-MP v2.1, условия приняты партнёром 15.10.2026' : 'ждём принятия условий партнёром'], ['Запуск', fromF('meta') ? '20.10.2026' : 'ещё не запускали']]);
  if (money) {
    b += (fromF('meta') ? facts([['Принято от партнёра', usd(takenAll())], ['Потрачено', usd(spentAll())], ['Резерв на хвосты', usd(reserveOf())], ['Остаток партнёра', usd(restAll())]]) : '') +
      (fromF('fnd') ? facts([['Лимит кампании', usd(capNow())], ['Переведено на баланс Facebook', usd(fbDone())]]) : '') +
      (fromF('inv') ? tbl([['Период'], ['Счёт'], ['Сумма', 1], ['Статус'], ['Выставлен']], payRows(false)) : '');
  }
  return sec('order', 'Заказ', money ? 'видеть в одном месте, где деньги партнёра: счета, оплата, остаток.' : 'видеть, что и на каких условиях заказано.', panel(b));
}
function secMeta() {
  if (!fromF('fnd')) return '';
  const can = is('mkt'), who = can ? 'mkt' : 'admin';
  const lnk = disclose('Ссылка с меткой кампании', field('lnk2', 'Метка ' + tag(), '<div class="copy"><input class="input" id="lnk2" readonly value="' + esc(link()) + '"><button class="btn" type="button" data-copy="lnk2">' + ic('copy') + 'Скопировать ссылку с меткой</button></div>', 'Метка в ссылках объявлений: по ней система привязывает заявки к заказу.'));
  const manual = disclose('Исключение: внести расход вручную', '<p class="note">Обычно расход приходит из Meta сам. Вручную вносят, только если связь с Meta недоступна. Сторож раз в час сверяет потраченное и остаток лимита, но расход периода для отчётности не пишет: его вносит маркетинг.</p>' +
    '<div class="hb-grid hb-grid--2">' + field('sp', 'Потрачено, $', '<input class="input" id="sp" inputmode="decimal" value="' + st.spent + '"' + (can ? '' : ' disabled') + '>') + field('rf', 'Возврат площадки, $', '<input class="input" id="rf" inputmode="decimal" value="' + st.refund + '"' + (can ? '' : ' disabled') + '>', 'Пусто - ноль') + '</div>' + errBox('spE') +
    '<div class="contact"><button class="btn btn--s" id="spSave" type="button"' + (can ? '' : ' disabled') + '>Внести расход вручную</button></div>' + (can ? '' : '<p class="note">Вносят маркетинг и полный админ.</p>'));
  return sec('meta', 'Кампания и расход', 'понять, сколько партнёр потратил и что осталось от лимита. Кампанию создаёт система, цифры раз в час приходят из Meta сами.', panel(campInfo() + metricsBlock(who) + lnk + manual));
}
/* Остановки по требованию партнёра: отдельная секция (в живом коде её видят партнёрский отдел, маркетинг и админ) */
function secStops() {
  if (!fromF('meta')) return '';
  const can = is('mkt');
  const rows = st.stops.length ? tbl([['Получено'], ['Отключить до'], ['Статус']], st.stops.map(s => [dt(s.recv) + (s.who === 'partner' ? ' (из кабинета партнёра)' : ''), s.auto ? 'сразу, системой' : dt(s.due), s.done ? (s.auto ? B('ok', 'Пауза в Meta ' + dt(s.doneMs), 'Система поставила кампанию на паузу сразу по требованию.') : B('ok', 'Отключено вручную ' + dt(s.doneMs), 'Пауза в Meta не прошла, маркетинг отключил кампанию сам.')) : B('err', 'Пауза в Meta не прошла: ждём ручного отключения', stopRule)])) : '<p class="note">Требований об остановке нет.</p>';
  const stopBtn = can && stopAllowed() && !stopOpen() ? '<div class="contact"><button class="btn btn--danger" id="stopBtn" type="button">Остановить расходы по требованию партнёра</button></div>' : '';
  return secWrap('stops', 'Остановки по требованию партнёра' + (st.stops.length ? ' ' + B('muted', String(st.stops.length)) : ''), panel(rows + stopBtn), !!stopOpen());
}
const leadRows = P => {
  const cn = clientNums(), pending = st.excp && !st.excpDone, dealDone = st.f > ix.com;
  const rows = [[pd().k4, 'ОАЭ', '29.10.2026', B('ok', 'Привязан сам'), B('ok', 'В работе')], [pd().dp, 'ОАЭ', '31.10.2026', cn.disp ? B('warn', 'Спор о доле', 'У клиента есть агент.') : B('ok', 'Привязан сам'), cn.disp ? B('muted', 'Ждёт решения') : B('muted', 'Новое')], [pd().dl, 'ОАЭ', '02.11.2026', B('ok', 'Привязан сам'), dealDone ? B('done', 'Покупка закрыта') : B('ok', 'Показ или встреча')]];
  if (st.excp) rows.unshift([pd().c5, 'ОАЭ', '19.10.2026', pending ? B('warn', P ? 'На разборе' : 'Не привязалась сама', 'Метка кампании есть, привязка не прошла.') : did('cli.link') === 'danger' ? B('muted', 'Без заказа') : B('ok', 'Привязана вручную'), pending ? B('muted', 'Ждёт решения') : B('muted', 'Новое'), pending]);
  return rows;
};
function secClients() {
  if (!fromF('cli')) return '';
  const cn = clientNums();
  const lr = leadRows(false), exc = lr.some(r => r[3].indexOf('Привязан сам') < 0);
  const leads = exc ? tbl([['Клиент'], ['Страна'], ['Пришёл'], ['Привязка'], ['Стадия']], lr.map(r => ['<b>' + r[0] + '</b>', r[1], r[2], r[3], r[4]])) : tbl([['Клиент'], ['Страна'], ['Пришёл'], ['Стадия']], lr.map(r => ['<b>' + r[0] + '</b>', r[1], r[2], r[4]]));
  const known = st.excp ? tbl([['Заявка'], ['Что известно'], ['Причина'], ['Состояние']], [['<b>' + pd().c5 + '</b>', 'метка ' + tag() + ' есть, привязка не прошла', 'пришла 19.10, до запуска заказа 20.10', st.excpDone ? B('muted', did('cli.link') === 'danger' ? 'Оставлена без заказа' : 'Привязана вручную') : B('warn', 'Ждёт решения: задача в очереди')]]) : '<p class="note">Сейчас таких заявок нет.</p>';
  const queue = disclose('Не привязались сами' + (cn.wait ? ' ' + B('warn', String(cn.wait)) : ''),
    '<h3 class="h4">Знаем точно: метка есть, привязка не прошла</h3>' + known +
    '<ul class="stack"><li><b>Заявка до запуска заказа.</b> Реклама ещё не шла, поэтому заявка не засчитывается заказу.</li><li><b>У клиента уже есть другой владелец</b> (например, агент). Автоматически не привязывается, открывается спор о доле.</li><li><b>Заказ остановлен или закрыт.</b> Система сама кладёт заявку в очередь.</li></ul>' +
    '<h3 class="h4">Не можем знать: метки нет</h3><div class="notice notice--warn" role="status">' + ic('triangle-alert') + '<div><p class="notice__t">Meta видит на ' + cn.meta + ' заявок больше, чем дошло с меткой</p><p>У Meta ' + metaN() + ' ' + plural(metaN(), 'заявка', 'заявки', 'заявок') + ', у нас с меткой ' + taggedN() + '. Частая причина: лид-формы Facebook без захода на сайт. Такие заявки привязываются только вручную.</p><p>' + NEW('Сверка числа заявок Meta с нашими: сейчас такой проверки нет, разницу никто не видит. Предложение: показывать расхождение и предупреждать, когда оно растёт.') + '</p></div></div>');
  const disp = disclose('Споры о доле' + (cn.disp ? ' ' + B('warn', String(cn.disp)) : ''), (dispOn() ? tbl([['Клиент'], ['Причина'], ['Решение']], [['<b>' + pd().dp + '</b>', 'У клиента есть агент', did('dsp.dispute') === 'danger' ? 'Закрыт 06.11.2026: клиент остаётся у агента' : did('dsp.dispute') ? 'Закрыт 06.11.2026: клиент остаётся за заказом партнёра' : st.f > ix.plan ? 'Решён в рабочем порядке' : 'Открыт 05.11.2026: решение принимает партнёрский отдел (задача в очереди)']]) : '<p class="note">Открытых споров нет. Если у клиента найдётся другой владелец, здесь появится спор и задача его разобрать.</p>'));
  return sec('clients', 'Клиенты и споры о доле', 'показать, кого привела реклама партнёра. Привязка автоматическая, вручную только исключения. Имён и телефонов здесь нет.', panel(leads + '<p class="note">Показаны последние 3 из ' + cn.n + ' обращений. Остальные привязаны так же, по метке кампании.</p>' + queue + disp));
}
const dealStatus = () => (did('tr.transfer') || st.f > ix.tr ? B('done', 'Выплачена', 'Документ ' + (st.bank || 'BD-…')) + ' ' + esc(st.bank || '') : st.f > ix.apr ? B('ok', 'Одобрена: Дмитрий, 13.11', 'Одобрил финансовый директор с паролем.') : st.f > ix.plan ? B('warn', 'Запланирована: Анна, 12.11, ждёт одобрения') : B('warn', 'Начислена, ждёт планирования'));
function secComm() {
  if (!(st.f > ix.com)) return '';
  return sec('comm', 'Комиссии и выплаты', 'записать, сколько заплатил застройщик, посчитать награду партнёра (30% от суммы без НДС и налогов) и провести выплату тремя шагами трёх разных людей.',
    panel(tbl([['Клиент'], ['Получено', 1], ['НДС', 1], ['Чистая база', 1], ['Награда 30%', 1], ['Статус']], [['<b>' + pd().dl + '</b> <span class="note">12.11.2026</span>', usd(10500), usd(500), usd(10000), '<b>' + usd(st.reward) + '</b>', dealStatus()]]) + (st.cancelled ? '<p class="note">' + B('muted', 'выплата отменялась') + ' Финансовый директор отменил выплату 13.11 и вернул её на планирование, причина записана в журнал.</p>' : '')));
}
function secStats() {
  const got = st.f > ix.com;
  return secWrap('summary', 'Сводка по партнёру', panel(facts([
    ['Внесено', usd(takenAllNow())], ['Потрачено', fromF('meta') ? usd(spentAll()) : usd(0)], ['Остаток', fromF('meta') ? usd(restAll()) : usd(takenAllNow())], ['Комиссий получено', got ? usd(10500) : usd(0)], ['Начислено партнёру', got ? usd(st.reward) : usd(0)], ['Выплачено партнёру', st.f > ix.tr ? usd(st.reward) : usd(0)], ['Долг по сторно', usd(0)]])));
}
const takenAllNow = () => (st.f > ix.cnf ? st.budget : 0) + (st.f > ix.cn2 || did('tr.confirm2') ? st.budget : 0);
/* Архив закрытых заказов как в живом коде (ArchiveSection, archive-view.ts): одно раскрытие, пояснение, у каждого заказа сразу видна карточка с итогом */
function archiveCard(title, rows) {
  return '<section class="panel stack"><h3 class="h4">' + title + '</h3><dl class="kv kv--s">' + rows.map(r => '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>').join('') + '</dl></section>';
}
function secArchive() {
  const money = is('fin', 'cfo', 'admin'), cards = [];
  if (st.f >= ix.done) {
    cards.push(archiveCard(MK[st.market].name + ', с 20.10.2026 по 30.11.2026, заказ …' + sfx(), [['Закрыт', '30.11.2026 11:00 (Дубай)']]
      .concat(money ? [['Бюджет в месяц', usd(st.budget)]] : [])
      .concat([['Клиентов привязано', String(taggedN())], ['Кампания Meta', 'номер ' + metaId() + (money ? ', потрачено ' + usd(spentAll()) + ' из лимита ' + usd(capNow()) : '')]])
      .concat(money ? [['Принято от партнёра', usd(takenAll())], ['Потрачено на рекламу', usd(spentAll())]].concat(st.refund > 0 ? [['Вернула рекламная площадка', usd(st.refund)]] : []).concat([['Удержано в резерве', usd(reserveOf())], ['Остаток к возврату партнёру', restAll() > 0 ? usd(restAll()) : 'нет'], ['Вознаграждение партнёру', 'начислено ' + usd(st.reward) + ', выплачено ' + usd(st.reward)]]) : [])));
  }
  cards.push(archiveCard('Таиланд, с 02.09.2026 по 30.09.2026, заказ …' + pd().old, [['Закрыт', '30.09.2026 11:00 (Дубай)']]
    .concat(money ? [['Бюджет в месяц', usd(2000)]] : [])
    .concat([['Клиентов привязано', '8'], ['Кампания Meta', 'номер ' + metaId(pd().old) + (money ? ', потрачено ' + usd(1700) + ' из лимита ' + usd(2000) : '')]])
    .concat(money ? [['Принято от партнёра', usd(2000)], ['Потрачено на рекламу', usd(1700)], ['Удержано в резерве', usd(200)], ['Остаток к возврату партнёру', usd(100)], ['Вознаграждение партнёру', 'не начислялось']] : [])));
  return secWrap('archive', 'Архив закрытых заказов (' + cards.length + ')', '<p class="note">Заказы, по которым реклама остановлена, новые платежи и расход не принимаются, а в работу заказ уже не вернуть. Только для просмотра.</p>' + cards.join(''));
}
/* Реквизиты для оплаты как в живом коде (PayRequisitesBlock): внизу списка медиапартнёров; видят отдел платежей и полный админ, правят только финдиректор и полный админ */
function secReq() {
  const can = is('cfo', 'admin'), r = st.hbreq, ok = reqOk(), shown = v => (v === '' ? '-' : esc(v));
  const inp = (k, hint) => field('hr-' + k, REQ_LABEL[k], '<input class="input" id="hr-' + k + '" value="' + esc(r[k] || '') + '" autocomplete="off"' + (can ? '' : ' disabled') + '>', hint);
  const hist = '<details class="disclose"><summary>История изменений (' + st.reqLog.length + ') ' + ic('chevron-down') + '</summary>' + (st.reqLog.length ? '<ul class="stack">' + st.reqLog.slice().reverse().map(c => '<li><b>' + c.t + ' (Дубай), ' + esc(c.who) + '</b><ul>' + c.d.map(x => '<li>' + REQ_LABEL[x.k] + ': было ' + shown(x.was) + ', стало ' + shown(x.now) + '</li>').join('') + '</ul></li>').join('') + '</ul>' : '<p class="note">Реквизиты ещё не вносились.</p>') + '</details>';
  return '<section class="stack" id="pay-requisites" aria-labelledby="mp-req-h"><div class="sec__head sec__head--row"><span class="hh"><h2 class="h4" id="mp-req-h">Реквизиты для оплаты</h2>' + B(ok ? 'ok' : 'err', ok ? 'заполнены' : 'не заполнены') + ' ' + NEW('Раньше реквизиты Housebook были вписаны в код. Теперь их вносит финансовый директор или полный админ, партнёр видит их в счёте.') + '</span><span class="note">оплата счетов партнёров: Swift на банк в Дубае, валюта USD</span></div>' +
    panel('<div class="stack"><p class="note">' + (ok ? 'Партнёры видят эти реквизиты в задаче «Оплатить счёт».' : 'Пока заполнены не все поля, партнёры видят «Реквизиты пришлёт менеджер»: неполные реквизиты им не показываются.') + (can ? '' : ' Вносить и менять реквизиты вправе только финансовый директор и полный администратор.') + '</p>' +
      '<div class="hb-grid hb-grid--2">' + inp('name') + inp('bank') + inp('addr') + inp('iban') + inp('swift', '8 или 11 знаков, например ABCDAEAAXXX.') + inp('purpose', 'Обязательно с {invoice}: туда подставится номер счёта партнёра.') + field('hr-cur', 'Валюта', '<input class="input" id="hr-cur" value="USD" disabled readonly>', 'Все счета в долларах США.') + '</div>' + errBox('hrE') +
      (can ? '<div><button class="btn btn--acc" type="button" id="hrSave">Сохранить реквизиты</button></div>' : '') + '</div>' + hist) + '</section>';
}

/* ---------- Журнал действий (только администратору): кто, когда, что сделал, было и стало ---------- */
const LOG = [
  { a: '-', t: '02.09.2026 10:20', who: 'Мария', role: 'Партнёрский отдел', type: 'Заказ', text: 'Создала заказ «Таиланд, 2 000 $ в месяц»', was: 'нет заказа', now: 'Оформляется' },
  { a: '-', t: '05.09.2026 12:10', who: 'Анна', role: 'Финансист', type: 'Счёт', text: 'Выставила счёт TP-2009-001 на 2 000 $', was: 'нет счёта', now: 'Ждём оплату' },
  { a: '-', t: '08.09.2026 15:30', who: 'Анна', role: 'Финансист', type: 'Деньги', text: 'Подтвердила поступление 2 000 $ по счёту TP-2009-001', was: 'Ждём оплату', now: 'Зачислен' },
  { a: '-', t: '30.09.2026 11:00', who: 'Мария', role: 'Партнёрский отдел', type: 'Закрытие', text: () => 'Закрыла заказ «Таиланд, 2 000 $ в месяц» (…' + pd().old + ')', was: 'Реклама идёт', now: 'Закрыт' },
  { a: 'req', t: '12.10.2026 11:05', who: 'Мария', role: 'Партнёрский отдел', type: 'Допуск', text: () => 'Допустила заявку «' + PN() + '», агент получил уведомление', was: 'Заявка', now: 'Допуск открыт' },
  { a: 'adm', t: () => (st.orderBy === 'partner' ? '15.10.2026 10:05' : '15.10.2026 10:00'), who: () => (st.orderBy === 'partner' ? PN() : 'Мария'), role: () => (st.orderBy === 'partner' ? 'партнёр, из кабинета' : 'Партнёрский отдел'), type: 'Заказ', text: () => (st.orderBy === 'partner' ? 'Оформил заказ «' + orderName() + '» и принял условия HB-MP v2.1 (подпись)' : 'Оформила заказ «' + orderName() + '» за партнёра'), was: 'нет заказа', now: 'Ждёт подтверждения' },
  { a: 'ord', t: '15.10.2026 10:12', who: 'Мария', role: 'Партнёрский отдел', type: 'Заказ', text: () => 'Подтвердила заказ «' + orderName() + '»', was: 'Ждёт подтверждения', now: () => 'Оформляется, бюджет ' + usd(st.budget) },
  { a: 'inv', t: '15.10.2026 15:30', who: 'Анна', role: 'Финансист', type: 'Счёт', text: () => 'Выставила счёт TP-2010-001 на ' + usd(st.budget), was: 'нет счёта', now: 'Ждём оплату' },
  { a: 'cnf', t: '19.10.2026 14:20', who: 'Анна', role: 'Финансист', type: 'Деньги', text: () => 'Подтвердила поступление ' + usd(st.budget) + ' по счёту TP-2010-001: деньги зачислены на счёт Housebook', was: 'Ждём оплату', now: 'Зачислен, пошли 24 часа' },
  { a: 'go', t: '20.10.2026 14:30', who: () => (did('go.launch') ? 'Мария' : 'Система'), role: () => (did('go.launch') ? 'Партнёрский отдел' : 'автозапуск'), type: 'Запуск', text: () => (did('go.launch') ? 'Запустила заказ вручную (автозапуск не сработал), создала кампанию ' : 'Запустила заказ сама после окна отказа и создала кампанию ') + campShort() + ' в Meta на паузе: лимит трат ' + usd(st.budget) + ', в день ' + dayTxt(), was: 'Окно отказа', now: 'Кампания создана, деньги на балансе Facebook ещё не переведены' },
  { a: 'fnd', t: '20.10.2026 15:10', who: 'Анна', role: 'Финансист', type: 'Деньги', text: () => 'Отметила перевод ' + usd(st.budget) + ' на баланс рекламного аккаунта Facebook', was: () => 'Переведено 0 $ из ' + usd(st.budget), now: () => 'Переведено ' + usd(st.budget) + ' из ' + usd(st.budget) },
  { a: 'cmp', t: '20.10.2026 16:20', who: 'Олег', role: 'Маркетинг', type: 'Реклама', text: () => 'Отметил запуск кампании ' + campShort() + '', was: 'Кампания не запущена', now: 'Кампания запущена' },
  { a: 'meta', t: '31.10.2026 18:00', who: 'Олег', role: 'Маркетинг', type: 'Реклама', text: () => (st.manual ? 'Внёс расход октября вручную по данным рекламного кабинета (сверка Meta расход периода не пишет)' : 'Подтвердил расход октября'), was: () => 'Потрачено 0 $, остаток ' + usd(st.budget), now: () => 'Потрачено ' + usd(st.spent) + ', резерв ' + usd(reserveOf()) + ', остаток ' + usd(restOf()) },
  { a: 'meta', t: '02.11.2026 09:00', who: 'Система', role: 'автоотчёт', type: 'Отчёт', text: 'Собрала и отправила партнёру отчёт за октябрь', was: 'Отчёта нет', now: 'Отчёт отправлен' },
  { a: 'meta', t: '02.11.2026 10:15', who: 'Система', role: 'автопривязка', type: 'Клиенты', text: () => 'Привязала к заказу ' + (taggedN() - (st.excp ? 1 : 0)) + ' ' + plural(taggedN() - (st.excp ? 1 : 0), 'обращение', 'обращения', 'обращений') + ' по метке кампании', was: 'Привязано 0', now: () => 'Привязано ' + (taggedN() - (st.excp ? 1 : 0)) },
  { a: 'dsp', t: '05.11.2026 09:40', who: 'Мария', role: 'Партнёрский отдел', type: 'Спор', text: () => 'Открыла спор о доле по клиенту ' + pd().dp + ': у клиента есть агент', was: 'Спора нет', now: 'Спор открыт' },
  { a: 'com', t: '12.11.2026 12:00', who: 'Анна', role: 'Финансист', type: 'Комиссия', text: () => 'Записала поступление комиссии 10 500 $ по клиенту ' + pd().dl + ' (НДС 500 $)', was: 'Комиссия не записана', now: () => 'Награда партнёра ' + usd(st.reward) },
  { a: 'plan', t: '12.11.2026 12:30', who: 'Анна', role: 'Финансист', type: 'Выплата', text: () => 'Запланировала выплату ' + usd(st.reward), was: 'нет выплаты', now: 'Запланирована' },
  { a: 'apr', t: '13.11.2026 10:05', who: 'Дмитрий', role: 'Финансовый директор', type: 'Выплата', text: () => 'Одобрил выплату ' + usd(st.reward) + ' (повторный ввод пароля)', was: 'Запланирована', now: 'Одобрена' },
  { a: 'inv2', t: '14.11.2026 11:00', who: 'Анна', role: 'Финансист', type: 'Счёт', text: () => 'Выставила счёт TP-2011-001 на ' + usd(st.budget) + ' за ноябрь', was: 'нет счёта', now: 'Ждём оплату' },
  { a: 'tr', t: () => '16.11.2026 15:10', who: 'Анна', role: 'Финансист', type: 'Выплата', text: () => 'Отметила выплату оплаченной, документ ' + (st.bank || 'BD-…'), was: 'Одобрена', now: 'Выплачена' },
  { a: 'cn2', t: '17.11.2026 10:00', who: 'Анна', role: 'Финансист', type: 'Деньги', text: () => 'Подтвердила поступление ' + usd(st.budget) + ' по счёту TP-2011-001', was: 'Ждём оплату', now: 'Зачислен' },
  { a: 'cn2', t: '18.11.2026 10:05', who: 'Система', role: 'автозапуск ноября', type: 'Реклама', text: () => 'Подняла лимит кампании ' + campShort() + ' до ' + usd(st.budget * 2) + ' после оплаты и 24 часов на отказ', was: () => 'Лимит ' + usd(st.budget), now: () => 'Лимит ' + usd(st.budget * 2) },
  { a: 'cls', t: '30.11.2026 11:00', who: 'Мария', role: 'Партнёрский отдел', type: 'Закрытие', text: 'Закрыла заказ, система поставила кампанию на паузу в Meta', was: 'Реклама идёт', now: 'Закрыт' },
  { a: 'ref', t: '02.12.2026 12:00', who: 'Анна', role: 'Финансист', type: 'Закрытие', text: () => 'Вернула партнёру остаток ' + usd(restAll()), was: () => 'Остаток ' + usd(restAll()), now: 'Остаток 0 $' }
];
function logEntries() {
  const e = LOG.filter(x => x.a === '-' || (reached(x.a) && !(x.a === 'dsp' && st.nodsp))).map(x => ({ t: val(x.t), who: val(x.who), role: val(x.role), type: x.type, text: val(x.text), was: val(x.was), now: val(x.now) }));
  const add = (id, o) => { if (did(id)) e.push(o(did(id))); };
  add('cli.link', k => ({ t: '02.11.2026 10:20', who: 'Мария', role: 'Партнёрский отдел', type: 'Клиенты', text: k === 'danger' ? 'Оставила заявку ' + pd().c5 + ' без заказа, причина записана' : 'Привязала заявку ' + pd().c5 + ' к заказу вручную (пришла до запуска заказа)', was: 'Не привязана', now: k === 'danger' ? 'Без заказа' : 'Привязана к заказу' }));
  add('ctr.accept', () => ({ t: '15.10.2026 11:30', who: PN(), role: 'партнёр, из кабинета', type: 'Заказ', text: 'Принял условия HB-MP v2.1 (подпись под договором)', was: 'Оформляется', now: 'Условия приняты' }));
  add('cli.remarks', () => ({ t: '05.11.2026 11:00', who: 'Мария', role: 'Партнёрский отдел', type: 'Отчёт', text: 'Ответила на замечания партнёра к отчёту за октябрь', was: 'Замечания без ответа', now: 'Ответ отправлен' }));
  add('dsp.dispute', k => ({ t: '06.11.2026 16:20', who: 'Мария', role: 'Партнёрский отдел', type: 'Спор', text: 'Закрыла спор по ' + pd().dp + ': клиент остаётся ' + (k === 'danger' ? 'у агента' : 'за заказом партнёра'), was: 'Спор открыт', now: 'Спор закрыт' }));
  add('apr.reqs', () => ({ t: '13.11.2026 12:40', who: PN(), role: 'партнёр, из кабинета', type: 'Выплата', text: 'Внёс реквизиты для выплаты (Swift, USD)', was: 'Реквизитов нет', now: 'Реквизиты внесены' }));
  st.stops.forEach(s => {
    e.push({ t: dt(s.req), who: s.who === 'partner' ? PN() : 'Олег', role: s.who === 'partner' ? 'партнёр, из кабинета' : 'Маркетинг', type: 'Остановка', text: s.who === 'partner' ? 'Партнёр запросил остановку расходов' : 'Записал требование партнёра остановить расходы', was: 'Реклама идёт', now: 'Остановка запрошена, срок ' + dt(s.due) });
    if (s.done) e.push(s.auto ? { t: dt(s.doneMs), who: 'Система', role: 'автопауза', type: 'Остановка', text: 'Поставила кампанию на паузу в Meta сразу по требованию', was: 'Остановка запрошена', now: 'Реклама остановлена' } : { t: dt(s.doneMs), who: 'Олег', role: 'Маркетинг', type: 'Остановка', text: 'Маркетинг отключил рекламу вручную: пауза в Meta не прошла', was: 'Остановка запрошена', now: 'Реклама остановлена' });
    if (s.fail) e.push({ t: dt(s.req), who: 'Система', role: 'автопауза', type: 'Остановка', text: 'Пауза в Meta не прошла: маркетингу поставлена задача остановить кампанию вручную, администратору ушла причина', was: 'Реклама идёт', now: 'Нужна ручная остановка' });
  });
  if (st.cancelled) e.push({ t: '13.11.2026 10:30', who: 'Дмитрий', role: 'Финансовый директор', type: 'Выплата', text: 'Отменил выплату, причина указана', was: 'Запланирована', now: 'Отменена' });
  if (st.halt) e.push({ t: F[st.f].now, who: st.halt.by === 'partner' ? PN() : (st.halt.by === 'fin' ? 'Анна' : 'Мария'), role: st.halt.by === 'partner' ? 'партнёр, из кабинета' : (st.halt.by === 'fin' ? 'Финансист' : 'Партнёрский отдел'), type: 'Отказ', text: st.halt.by === 'partner' ? 'Партнёр отказался от заказа в окне отказа' : 'Записала отказ партнёра', was: 'Окно отказа', now: 'Отказ, деньги возвращаются' });
  if (st.halt && st.did['halt.refund']) e.push({ t: dt(st.halt.rat), who: 'Анна', role: 'Финансист', type: 'Возврат', text: 'Вернула ' + usd(st.budget) + ' партнёру после отказа, документ ' + st.halt.rdoc, was: 'Возврат ждёт', now: 'Деньги возвращены' });
  const key = t => t.slice(6, 10) + t.slice(3, 5) + t.slice(0, 2) + t.slice(11);
  return e.sort((a, b) => (key(a.t) < key(b.t) ? 1 : -1));
}
/* Журнал действий как в живом коде (JournalSection): три колонки, фильтры «Сотрудник», «Действие», «С даты», «По дату» */
function secLog() {
  const all = logEntries(), lf = st.logF;
  const iso = t => t.slice(6, 10) + '-' + t.slice(3, 5) + '-' + t.slice(0, 2);
  const rows = all.filter(r => (!lf.who || r.who === lf.who) && (!lf.type || r.type === lf.type) && (!lf.from || iso(r.t) >= lf.from) && (!lf.to || iso(r.t) <= lf.to));
  const whos = Array.from(new Set(all.map(r => r.who))), types = Array.from(new Set(all.map(r => r.type)));
  const sel = (id, label, opts, cur) => '<div class="field"><label for="' + id + '">' + label + '</label><select class="select select--s" id="' + id + '">' + opts.map(o => '<option value="' + esc(o[0]) + '"' + (o[0] === cur ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div>';
  const dat = (id, label, hint, cur) => field(id, label, '<input class="input" type="date" id="' + id + '" value="' + esc(cur) + '">', hint);
  const bar = '<div class="hb-grid hb-grid--2">' + sel('lw', 'Сотрудник', [['', 'Все сотрудники']].concat(whos.map(w => [w, w])), lf.who) + sel('lt', 'Действие', [['', 'Все действия']].concat(types.map(w => [w, w])), lf.type) + dat('lf', 'С даты', 'Сутки по Дубаю.', lf.from) + dat('lto', 'По дату', 'Включительно.', lf.to) + '</div>';
  const table = rows.length ? tbl([['Когда (Дубай)'], ['Кто'], ['Что сделано']], rows.map(r => [r.t, r.who + '<small>' + r.role + '</small>', r.text])) : '<p class="note">Под эти условия записей нет.</p>';
  return secWrap('journal', 'Журнал действий', bar + table, !!(lf.who || lf.type || lf.from || lf.to));
}
const stopStripFor = () => {
  const s = stopOpen() || (stopLast() && stopLast().done ? stopLast() : null); if (!s) return '';
  return alarmStrip(partnerOf(st.pid).name, st.pid, s, st.stops.indexOf(s), false);
};
/* Секции карточки по роли (матрица card-sections.ts живого кода): чужих секций нет вовсе; журнал последним, только у полного админа */
function pageAdmin() {
  const secs = [];
  if (is('admin')) secs.push(secStats());
  if (is('dept', 'admin')) secs.push(secAccess());
  if (is('dept', 'fin', 'cfo', 'admin')) secs.push(secOrder());
  if (is('mkt', 'admin')) secs.push(secMeta());
  if (is('dept', 'mkt', 'admin')) secs.push(secStops());
  if (is('dept', 'admin')) secs.push(secClients());
  if (is('fin', 'cfo', 'admin')) secs.push(secComm());
  if (is('dept', 'fin', 'cfo', 'admin')) secs.push(secArchive());
  if (is('admin')) secs.push(secLog());
  return [headAdmin(), stopStripFor(), renderQueue(false), renderPath(false), '<div class="stack stack--l">' + secs.join('') + '</div>'].join('');
}

/* ---------- Кабинет партнёра /partner/media ---------- */
function stopBlockP() {
  const s = stopOpen(), l = stopLast();
  if (s) return '<div class="notice notice--warn" role="status">' + ic('timer') + '<div><p class="notice__t">Запрос на остановку принят ' + dt(s.recv) + '</p><p>Реклама будет отключена до ' + dt(s.due) + ' (п. 5.3 договора).</p></div></div>';
  if (l && l.done) return '<div class="notice" role="status">' + ic('circle-check') + '<p class="notice__t">Реклама остановлена ' + dt(l.doneMs) + '</p></div>';
  return stopAllowed() ? '<div class="contact"><button class="btn btn--danger" id="pStop" type="button">' + ic('pause') + 'Остановить расходы</button><span class="note">Остановить расходы можно в любой момент (п. 5.3 договора).</span></div>' : '';
}
function pageCabinet() {
  const f = st.f;
  const head = '<section class="phead phead--kab" aria-labelledby="pt"><div class="wrap"><div class="phead__row"><div class="phead__main"><h1 id="pt">Медиапартнёр</h1><p class="note">Заказ на рекламу, платежи, обращения и выплаты по договору. Суммы в долларах США.</p></div></div></div></section>';
  const secH = (id, t) => '<h2 class="h4" id="' + id + '">' + t + '</h2>';
  let out = head + renderQueue(true) + renderPath(true);
  if (fromF('fnd') || stopAllowed()) {
    out += '<section class="stack" aria-labelledby="mp-ads">' + secH('mp-ads', 'Реклама по вашему заказу') + (fromF('fnd') ? panel(metricsBlock('partner') + stopBlockP()) : '') + '</section>';
  }
  /* «Заказ» как в живом коде (OrdersSection): действующий заказ сверху, закрытые свёрнуты в «Закрытые заказы (N)» */
  if (fromF('adm')) {
    const closedNow = f >= ix.ref || !!st.halt, nextM = st.mkNext, picks = ['dubai', 'thailand', 'trust'].filter(k => k !== st.market && k !== nextM);
    const nm = new Date(nowMs()); nm.setMonth(nm.getMonth() + 1, 1);
    const card = (market, terr, budget, status, since, extra, payer) => panel(kv([['Рынок', market], ['Территории', terr], ['Бюджет в месяц', usd(budget)]].concat(payer ? [['Кто платит', payer]] : []).concat([['Статус заказа', status]])) + (extra || '') + '<p class="note">Заказ создан: ' + since + '</p>');
    const mkChange = !closedNow && picks.length ? '<div class="stack"><p class="note">Страну можно сменить не чаще одного раза в календарный месяц. Новая страна вступает в силу со следующего периода, после зачисления платежа.</p><div class="seg seg--s" role="group" aria-label="Новая страна">' + picks.map(k => '<button type="button" data-mkpick="' + k + '" aria-pressed="' + (st.mkPick === k) + '">' + MK[k].name + '</button>').join('') + '</div><div><button class="btn btn--s" type="button" id="mkGo"' + (nextM || !st.mkPick ? ' disabled' : '') + '>Сменить страну</button></div>' + (nextM ? '<p class="note">Следующая смена возможна с 01.' + pad2(nm.getMonth() + 1) + '.' + nm.getFullYear() + '</p>' : '') + '</div>' : '';
    const nextNote = nextM ? '<p class="note">Следующий рынок: ' + MK[nextM].name + '. С периода ' + nm.getFullYear() + '-' + pad2(nm.getMonth() + 1) + '.</p>' : '';
    const stat = st.halt ? B('err', 'Отказ партнёра') : closedNow ? B('err', 'Завершён') : stopLast() && stopLast().done ? B('warn', 'Расходы остановлены') : fromF('go') ? B('ok', 'Работает') : B('muted', 'Подписан');
    const cur = fromF('ord') ? card(MK[st.market].name, MK[st.market].terr.join(', '), st.budget, stat, '15.10.2026', nextNote + mkChange, PAYER[st.payer]) : '';
    const closed = (closedNow ? [cur] : []).concat(fromF('ord') ? [card('Таиланд', 'Таиланд (TH)', 2000, B('err', 'Завершён'), '02.09.2026')] : []);
    out += '<section class="stack" aria-labelledby="mp-orders">' + secH('mp-orders', 'Заказ') + (closedNow ? '' : cur) + (closed.length ? disclose('Закрытые заказы (' + closed.length + ')', closed.join('')) : '') + '</section>';
  }
  if (fromF('inv')) {
    const m = fromF('meta'), sp = m ? st.spent : 0, rs = m ? reserveOf() : 0, rows = payRows(true);
    const cells = rows.map((r, i) => [r[0], r[1], r[2], r[3], i === 0 ? (m ? usd(sp) : '') : '', i === 0 ? (m ? usd(rs) : '') : '', i === 0 ? (m ? usd(restOf()) : '') : '']);
    out += '<section class="stack" aria-labelledby="mp-pay">' + secH('mp-pay', 'Платежи и бюджет') + tbl([['Период'], ['Счёт'], ['Сумма', 1], ['Статус'], ['Потрачено', 1], ['Резерв', 1], ['Остаток', 1]], cells) + '<p class="note">Остаток = Поступило - Потрачено + возвраты рекламной площадки - Резерв. Лимит принятых платежей в первый цикл: ' + usd(4000) + '. Остаток переносится на следующий период по правилам договора.</p></section>';
  }
  if (fromF('cli')) {
    const cn = clientNums();
    out += '<section class="stack" aria-labelledby="mp-leads">' + secH('mp-leads', 'Обращения') + '<p class="note">Обезличенный список: без имён и контактов. Номер HB нужен для сверки с менеджером. Клиенты появляются здесь сами, ничего вносить не нужно.</p>' +
      tbl([['Номер'], ['Страна'], ['Стадия'], ['Дата обращения'], ['Окно атрибуции до']], leadRows(true).map(r => [r[5] ? 'Ожидает разбора' : r[0], r[1], r[5] ? 'уточняется' : r[4], r[2], r[2].slice(0, 6) + (+r[2].slice(6) + 1)])) + '<p class="note">Показаны последние обращения, всего ' + taggedN() + ' за октябрь.</p></section>';
  }
  if (f > ix.com) {
    out += '<section class="stack" aria-labelledby="mp-rc">' + secH('mp-rc', 'Комиссии и выплаты') + tbl([['Номер'], ['Получено', 1], ['Налоги', 1], ['Вычеты'], ['Награда 30%', 1], ['Статус']], [[pd().dl, usd(10500), usd(500), 'НДС 5% по счёту застройщика', usd(st.reward), (did('tr.transfer') || f > ix.tr) ? B('done', 'Выплачена ' + dShort(parseNow('16.11.2026 15:10')) + '.' + '2026') + ' ' + esc(st.bank || '') : f > ix.apr ? B('ok', 'Одобрена') : f > ix.plan ? B('muted', 'Запланирована') : B('muted', 'Начислена')]]) + '</section>';
  }
  return out;
}

/* ---------- Партнёры: живой «МП Агент» + снимки состояния остальных (разные точки пути, у каждого свои часы) ---------- */
const mkSnap = (fid, o) => Object.assign(snapDef(), { f: ix[fid] }, o || {});
const PARTNERS = [
  { id: 'mpa', name: 'МП Агент', origin: 'Из агентов', sn: () => snapDef() },
  { id: 'gulf', name: 'Gulf Leads FZ', origin: 'С сайта', sn: () => mkSnap('pay', { budget: 3000, spent: 2250 }) },
  { id: 'palm', name: 'Palm Reach Media', origin: 'Из агентов', sn: () => mkSnap('inv', { budget: 2000, spent: 1500, adj: 20 * 3600000 }) },
  { id: 'aur', name: 'Aurora Ads', origin: 'С сайта', sn: () => mkSnap('win', { budget: 2500, spent: 1875 }) },
  { id: 'nom', name: 'Nomad Capital Media', origin: 'Из агентов', sn: () => mkSnap('dsp', { budget: 2000, spent: 1500 }) },
  { id: 'dune', name: 'Dune Media', origin: 'С сайта', sn: () => mkSnap('plan', { budget: 2000, spent: 1500, reward: 3000, adj: parseNow('20.11.2026 12:00') - parseNow('12.11.2026 12:30') }) },
  { id: 'sun', name: 'Sun&Sand Promo', origin: 'С сайта', sn: () => mkSnap('apr', { budget: 4000, spent: 3000, reward: 4500, adj: parseNow('01.12.2026 12:00') - parseNow('13.11.2026 10:05') }) },
  { id: 'oce', name: 'Ocean Reach', origin: 'Из агентов', sn: () => { const req = parseNow('03.11.2026 09:30'), tm = stopTerms(req); return mkSnap('cli', { budget: 3000, spent: 2250, adj: parseNow('03.11.2026 13:30') - parseNow('02.11.2026 10:15'), stops: [{ who: 'partner', req: tm.req, recv: tm.recv, due: tm.due, done: false, doneMs: 0, fail: true, auto: false, ts: 0 }] }); } }
];
function openPartner(pid, role, taskId) {
  if (pid !== st.pid) { st.store[st.pid] = takeSnap(); st.pid = pid; putSnap(st.store[pid] || partnerOf(pid).sn()); }
  st.mode = 'admin'; if (role) st.role = role; st.focus = taskId || null;
  render(); writeHash(); if (!taskId) window.scrollTo(0, 0);
}

/* ---------- Список медиапартнёров /admin/media-partners ---------- */
function pMetrics() {
  const cn = clientNums(), s = stopOpen(), done = st.f >= ix.done || !!st.halt;
  const pay = st.f > ix.com && st.f <= ix.tr && !did('tr.transfer');
  return { stage: stageName(), stop: s ? s : null, stopIdx: s ? st.stops.indexOf(s) : -1, n: cn.n, wait: cn.wait, disp: cn.disp,
    camp: !fromF('meta') ? '-' : stopLast() && stopLast().done ? 'остановлена' : st.f >= ix.cls ? 'закрыта' : 'идёт',
    spend: fromF('meta') ? spentAll() : 0, toCredit: (atF('pay') || atF('cn2') || (atF('tr') && !did('tr.confirm2'))) ? st.budget : 0, toPay: pay ? st.reward : 0, payDue: pay ? payDue().due : 0, now: nowMs(),
    cfo: atF('apr') && !did('apr.approve') ? st.reward : 0, taken: takenAllNow(), reward: st.f > ix.com ? st.reward : 0, paid: st.f > ix.tr ? st.reward : 0,
    active: fromF('ord') && !done, admit: atF('req') && !st.halt };
}
function myTasks(role) {
  const out = [];
  eachP((p, sn) => { openTasks(role === 'admin' ? null : role).forEach(t => { if (t.optional || t.role === 'partner' || (role === 'admin' && t.id === 'req.admit')) return; const d = dueOf(t), n = nowMs(); out.push({ p: p, id: t.id, role: t.role, short: val(t.short), d: d, n: n, rem: d ? d.due - n : Infinity }); }); });
  return out.sort((a, b) => a.rem - b.rem);
}
/* В списке у всех строк одно «сегодня»: часы живого партнёра (МП Агент). Сроки остальных пересчитываются от него (см. dueChip). */
function pageList() {
  CTX.list = withSnap(snapOf(PARTNERS[0]), nowMs);
  try { return pageListBody(); } finally { CTX.list = null; }
}
function pageListBody() {
  const role = st.role, rows = eachP((p, sn) => Object.assign({ p: p }, pMetrics()));
  const adm = role === 'admin';
  const alarms = [];
  eachP((p, sn) => { const s = stopOpen(); if (s) alarms.push(alarmStrip(p.name, p.id, s, st.stops.indexOf(s), true)); });
  const mine = myTasks(role);
  const taskTbl = mine.length ? tbl([['Партнёр']].concat(adm ? [['Роль']] : []).concat([['Задача'], ['Срок'], ['']]), mine.map(m => [partnerLink(m.p)].concat(adm ? [B('muted', RNT[m.role])] : []).concat([m.short, m.d ? dueChip(m.d, m.n) : B('muted', 'срок не задан', NODUE), '<button class="btn btn--s" type="button" data-go="' + m.p.id + '" data-gotask="' + m.id + '" data-gorole="' + m.role + '">Перейти к задаче</button>']))) : '<p class="lead">Сейчас у вас задач нет.</p>';
  const stageB = r => B(r.stage === 'Отказался от заказа' ? 'err' : r.stage === 'Закрыт' ? 'muted' : 'ok', r.stage) + (r.stop ? ' ' + B('err', 'остановка запрошена', 'Партнёр потребовал остановить расходы. Срок отключения в красной полосе сверху.') : '');
  const R = (name, sub) => [name, sub];
  let head, body;
  if (role === 'dept') { head = [['Партнёр'], ['Этап пути'], ['Клиенты', 1], ['Ждут привязки', 1], ['Споры', 1]]; body = rows.map(r => [partnerLink(r.p), stageB(r), r.n, r.wait, r.disp]); }
  else if (role === 'mkt') { head = [['Партнёр'], ['Кампания'], ['Расход месяца', 1], ['Остановки']]; body = rows.map(r => [partnerLink(r.p), r.camp, r.spend ? usd(r.spend) : '-', r.stop ? B('err', 'запрошена') : stageLast(r)]); }
  else if (role === 'fin') { head = [['Партнёр'], ['К зачислению', 1], ['К выплате', 1], ['Долг по сторно', 1]]; body = rows.map(r => [partnerLink(r.p), r.toCredit ? usd(r.toCredit) : '-', r.toPay ? usd(r.toPay) + ' <span class="note">срок ' + dShort(shiftT(r.payDue, r.now)) + '</span>' : '-', '-']); }
  else if (role === 'cfo') { head = [['Партнёр'], ['Выплаты на одобрение', 1]]; body = rows.map(r => [partnerLink(r.p), r.cfo ? usd(r.cfo) : '-']); }
  else { head = [['Партнёр'], ['Этап пути'], ['Клиенты', 1], ['Расход', 1], ['К выплате', 1], ['Остановка']]; body = rows.map(r => [partnerLink(r.p), stageB({ stage: r.stage }), r.n, r.spend ? usd(r.spend) : '-', r.toPay ? usd(r.toPay) : '-', r.stop ? B('err', 'запрошена') : '-']); }
  const tblP = tbl(head, body, 'tbl--link');
  let sum = '', admits = '';
  if (adm) {
    const sa = (k) => rows.reduce((a, r) => a + r[k], 0);
    sum = '<section class="stack" aria-labelledby="h-sum"><h2 class="h4" id="h-sum">Сводка по программе</h2>' + panel(facts([['Партнёров', rows.length], ['Активных заказов', rows.filter(r => r.active).length], ['Внесено', usd(sa('taken'))], ['Потрачено', usd(sa('spend'))], ['Начислено', usd(sa('reward'))], ['Выплачено', usd(sa('paid'))]])) + '</section>';
    const ad = rows.filter(r => r.admit);
    admits = '<section class="stack" aria-labelledby="h-adm"><h2 class="h4" id="h-adm">Заявки к допуску ' + B(ad.length ? 'warn' : 'muted', String(ad.length)) + '</h2>' + (ad.length ? tbl([['Партнёр'], ['Откуда'], ['Подана'], ['']], ad.map(r => [partnerLink(r.p), r.p.origin, '12.10.2026 10:42 (Дубай)', '<button class="btn btn--s" type="button" data-go="' + r.p.id + '" data-gotask="req.admit" data-gorole="dept">Рассмотреть заявку</button>'])) : '<p class="note">Новых заявок нет.</p>') + '</section>';
  }
  const head1 = '<section class="phead phead--kab" aria-labelledby="pt"><div class="wrap"><div class="phead__row"><div class="phead__main"><h1 id="pt">Медиапартнёры</h1><p class="note">Партнёры, которые заказывают рекламу у Housebook. Вы смотрите как: ' + ROLES[role].name + (adm ? '' : ' (' + ROLES[role].who + ')') + '.</p></div><div class="phead__acts"><button type="button" class="btn">' + ic('refresh') + 'Обновить</button></div></div></div></section>';
  return head1 + alarms.join('') +
    '<section class="stack" aria-labelledby="h-mine"><div class="sec__head sec__head--row"><span class="hh"><h2 class="h4" id="h-mine">' + (adm ? 'Задачи сотрудников' : 'Мои задачи') + '</h2>' + B(mine.length ? 'warn' : 'muted', mine.length ? String(mine.length) : 'нет') + '</span><span class="note">по всем партнёрам, ближайший срок сверху</span></div>' + panel(taskTbl) + '</section>' +
    sum + admits + '<section class="stack" aria-labelledby="h-all"><h2 class="h4" id="h-all">Партнёры</h2>' + tblP + '</section>' + (role === 'fin' || role === 'cfo' || adm ? secReq() : '');
}
const partnerLink = p => '<a href="#" data-open="' + p.id + '"><b>' + esc(p.name) + '</b></a>';
const stageLast = r => (r.camp === 'остановлена' ? B('muted', 'остановлена') : '-');

/* ---------- Демо-панель ---------- */
function renderDemo() {
  const m = st.mode, card = m !== 'list', box = $('#demo');
  const seg = (attr, label, arr, cur) => '<div class="seg seg--s" role="group" aria-label="' + label + '">' + arr.map(a => '<button type="button" ' + attr + '="' + a[0] + '" aria-pressed="' + (cur === a[0]) + '">' + a[1] + '</button>').join('') + '</div>';
  const themeSeg = seg('data-th', 'Тема макета', [['light', 'Светлая'], ['dark', 'Тёмная']], window.mkTheme ? window.mkTheme.get() : 'light');
  const step = '<button type="button" class="btn btn--s" id="bPrev"' + (st.f === 0 ? ' disabled' : '') + '>' + ic('chevron-left', 'ic--16') + 'Назад</button><button type="button" class="btn btn--s btn--acc" id="bNext"' + (st.f === LAST ? ' disabled' : '') + '>Следующий шаг' + ic('arrow-right', 'ic--16') + '</button>';
  const where = (m === 'list' ? 'Список' : m === 'admin' ? 'Карточка' : 'Кабинет партнёра') + ', ' + (m === 'partner' ? 'партнёр' : ROLES[st.role].name) + (card ? ', ' + esc(partnerOf(st.pid).name) + ', кадр ' + (st.f + 1) + ' из ' + F.length : '');
  if (!st.demoOpen) {
    box.innerHTML = '<div class="mk-bar__row">' + B('start', 'только макет') + '<span class="note">' + where + '</span><span class="mk-bar__end">' + (card ? step : '') + themeSeg + '<button type="button" class="btn btn--s btn--quiet" id="demoToggle">Развернуть панель</button></span></div>';
  } else {
    box.innerHTML = '<div class="mk-bar__row">' + B('start', 'только макет') + seg('data-mode', 'Экран', [['list', 'Список'], ['admin', 'Карточка'], ['partner', 'Кабинет партнёра']], m) +
      (m !== 'partner' ? '<span class="note">Смотрю как:</span>' + seg('data-role', 'Роль', Object.keys(ROLES).map(k => [k, ROLES[k].name + (k === 'admin' ? '' : ' (' + ROLES[k].who + ')')]), st.role) : '<span class="note">Партнёр видит только своё: заказ, платежи, клиентов без имён, выплаты</span>') +
      (m === 'admin' ? '<span class="note">Соединитель:</span>' + seg('data-conn', 'Соединитель пути', [['line', 'линия'], ['arrow', 'линия со стрелкой']], st.conn) : '') + '<span class="note">Тема:</span>' + themeSeg + '<button type="button" class="btn btn--s btn--quiet mk-bar__end" id="demoToggle">Свернуть панель</button></div>' +
      (card ? '<div class="mk-bar__row">' + step + '<button type="button" class="btn btn--s btn--quiet" id="bReset">Сначала</button><span class="note">Партнёр: ' + esc(partnerOf(st.pid).name) + ', кадр ' + (st.f + 1) + ' из ' + F.length + '</span>' +
        '<label class="check"><input type="checkbox" id="xc"' + (st.excp ? ' checked' : '') + '><span>Исключение: 1 заявка не привязалась сама</span></label><label class="check"><input type="checkbox" id="xr"' + (st.remarks ? ' checked' : '') + '><span>Партнёр прислал замечания к отчёту</span></label><label class="check"><input type="checkbox" id="xp"' + (st.pauseFail ? ' checked' : '') + '><span>Пауза в Meta не пройдёт</span></label><label class="check"><input type="checkbox" id="xq"' + (reqOk() ? '' : ' checked') + '><span>Реквизиты Housebook не заполнены</span></label><span class="note">Сторож Meta:</span><select class="select select--s" id="xa" aria-label="Тревога сторожа Meta">' + [['', 'тревог нет'], ['cap_removed', 'лимит снят'], ['cap_over_paid', 'лимит больше оплаченного'], ['active_while_stopped', 'кампания идёт у остановленного заказа'], ['account_not_usd', 'кабинет не в USD']].map(o => '<option value="' + o[0] + '"' + (st.alert === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select><span class="note">Переключатели только для показа макета. Имена сотрудников вымышлены. Шаги в пути тоже можно нажимать.</span></div>' : '<div class="mk-bar__row"><span class="note">Нажмите на партнёра, чтобы открыть его карточку, или «Перейти к задаче». У каждого партнёра свои часы и своя точка пути.</span></div>');
  }
  $$('#demo [data-mode]').forEach(b => { b.onclick = () => { st.mode = b.getAttribute('data-mode'); render(); writeHash(); window.scrollTo(0, 0); }; });
  $$('#demo [data-conn]').forEach(b => { b.onclick = () => { st.conn = b.getAttribute('data-conn'); render(); }; });
  $$('#demo [data-role]').forEach(b => { b.onclick = () => { st.role = b.getAttribute('data-role'); render(); writeHash(); }; });
  $('#demoToggle').onclick = () => { st.demoOpen = !st.demoOpen; render(); };
  $$('#demo [data-th]').forEach(b => { b.onclick = () => { if (window.mkTheme) window.mkTheme.set(b.getAttribute('data-th')); renderDemo(); }; });
  const nx = $('#bNext'); if (nx) nx.onclick = advance; const pv = $('#bPrev'); if (pv) pv.onclick = () => setF(st.f - 1);
  const rs = $('#bReset'); if (rs) rs.onclick = () => { putSnap(snapDef()); st.logF = { who: '', type: '', from: '', to: '' }; st.mkPick = ''; setF(0); };
  const xc = $('#xc'); if (xc) xc.onchange = e => { st.excp = e.target.checked; st.excpDone = false; delete st.did['cli.link']; render(); writeHash(); };
  const xr = $('#xr'); if (xr) xr.onchange = e => { st.remarks = e.target.checked; delete st.did['cli.remarks']; render(); };
  const xp = $('#xp'); if (xp) xp.onchange = e => { st.pauseFail = e.target.checked; render(); };
  const xq = $('#xq'); if (xq) xq.onchange = e => { st.hbreq = e.target.checked ? Object.assign(HBREQ0(), { name: '', bank: '', addr: '', iban: '', swift: '' }) : HBREQ0(); render(); };
  const xa = $('#xa'); if (xa) xa.onchange = e => { st.alert = e.target.value; render(); };
}

/* ---------- Адрес: кадр, роль, режим, партнёр ---------- */
function writeHash() { try { history.replaceState(null, '', '#f=' + st.f + '&r=' + st.role + '&m=' + st.mode + '&p=' + st.pid + '&x=' + (st.excp ? 1 : 0)); } catch (e) { /* адрес не меняем */ } }
function readHash() {
  const h = location.hash, g = k => { const m = new RegExp('[#&]' + k + '=(\\w+)').exec(h); return m ? m[1] : null; };
  const p = g('p'); if (p && p !== st.pid && PARTNERS.some(x => x.id === p)) { st.store[st.pid] = takeSnap(); st.pid = p; putSnap(st.store[p] || partnerOf(p).sn()); }
  if (g('f') !== null) { st.f = Math.min(LAST, +g('f')); if (skipped(st.f)) st.f++; } if (g('r') && ROLES[g('r')]) st.role = g('r'); if (['list', 'admin', 'partner'].indexOf(g('m')) >= 0) st.mode = g('m'); if (g('x') !== null) st.excp = g('x') === '1';
}

/* ---------- Выпадающие списки кита ---------- */
/* Вместо родных select: разметка и клавиши те же, что у customSelect в js/hb-ui.js (.cs > button.cs__btn.select + .cs__pop > ul.cs__list > li.cs__opt).
   В ките функция идёт по select.select один раз на загрузке страницы, а макет перерисовывает экран целиком, поэтому здесь она зовётся после каждой отрисовки.
   data-native ставится затем, чтобы hb-ui.js не обернул тот же select второй раз. Значения, выставленные в bind, подхватываются при сборке. */
const csClose = []; let csN = 0;
const csNorm = t => t.toLowerCase().replace(/ё/g, 'е');
function kitSelect(sel) {
  const n = ++csN, opts = Array.prototype.slice.call(sel.options), wrap = document.createElement('div');
  wrap.className = 'cs'; sel.parentNode.insertBefore(wrap, sel); wrap.appendChild(sel);
  sel.classList.add('cs__native'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true'); sel.setAttribute('data-native', '');
  const lab = sel.id && $('label[for="' + sel.id + '"]'), al = sel.getAttribute('aria-label');
  if (lab && !lab.id) lab.id = 'mcs-l' + n;
  const trig = document.createElement('button'); trig.type = 'button'; trig.className = 'cs__btn select'; trig.disabled = sel.disabled;
  sel.classList.forEach(c => { if (c.indexOf('select--') === 0) trig.classList.add(c); });
  trig.setAttribute('aria-haspopup', 'listbox'); trig.setAttribute('aria-expanded', 'false'); trig.setAttribute('aria-controls', 'mcs-list' + n);
  trig.innerHTML = '<span class="cs__val" id="mcs-v' + n + '"></span>';
  if (lab) trig.setAttribute('aria-labelledby', lab.id + ' mcs-v' + n);
  else if (al) { trig.id = 'mcs-b' + n; trig.setAttribute('aria-label', al); trig.setAttribute('aria-labelledby', trig.id + ' mcs-v' + n); }
  const pop = document.createElement('div'); pop.className = 'cs__pop'; pop.hidden = true; if (pop.showPopover) pop.popover = 'manual';
  const q = opts.length > 5 ? Object.assign(document.createElement('input'), { type: 'search', className: 'cs__q input input--s', placeholder: 'Найти', autocomplete: 'off' }) : null;
  if (q) { q.setAttribute('aria-label', 'Поиск по списку'); q.setAttribute('aria-controls', 'mcs-list' + n); pop.appendChild(q); }
  const list = document.createElement('ul'); list.className = 'cs__list'; list.id = 'mcs-list' + n; list.setAttribute('role', 'listbox'); list.tabIndex = -1;
  if (lab) list.setAttribute('aria-labelledby', lab.id); else if (al) list.setAttribute('aria-label', al);
  const items = opts.map((o, i) => { const li = document.createElement('li'); li.id = 'mcs' + n + '-' + i; li.className = 'cs__opt'; li.setAttribute('role', 'option'); li.dataset.i = i; li.textContent = o.textContent; if (o.disabled) li.setAttribute('aria-disabled', 'true'); list.appendChild(li); return li; });
  const none = document.createElement('li'); none.className = 'cs__none'; none.setAttribute('role', 'presentation'); none.textContent = 'Ничего не найдено'; none.hidden = true; list.appendChild(none);
  pop.appendChild(list); wrap.append(trig, pop);
  let act = null;
  const vis = () => items.filter(li => !li.hidden && li.getAttribute('aria-disabled') !== 'true');
  const sync = () => { items.forEach((li, i) => li.setAttribute('aria-selected', String(opts[i].selected))); const o = opts.filter(x => x.selected)[0]; $('.cs__val', trig).textContent = o ? o.textContent : 'Все'; wrap.classList.add('has-val'); };
  const setAct = li => { act = li || null; items.forEach(x => x.classList.toggle('is-act', x === act)); const owner = q || list; if (act) { owner.setAttribute('aria-activedescendant', act.id); act.scrollIntoView({ block: 'nearest' }); } else owner.removeAttribute('aria-activedescendant'); };
  const place = () => {
    const r = trig.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) { close(false); return; }
    pop.style.minWidth = r.width + 'px'; const ph = pop.offsetHeight, pw = pop.offsetWidth, below = innerHeight - r.bottom - 8, up = below < ph && r.top - 8 > below;
    pop.style.left = Math.max(8, Math.min(r.left, innerWidth - pw - 8)) + 'px'; pop.style.top = Math.max(8, up ? r.top - ph - 6 : r.bottom + 6) + 'px';
  };
  const filter = () => { const v = csNorm(q.value.trim()); items.forEach(li => { li.hidden = !!v && csNorm(li.textContent).indexOf(v) < 0; }); none.hidden = items.some(li => !li.hidden); setAct(vis()[0]); if (!pop.hidden) place(); };
  const open = () => {
    if (!pop.hidden || trig.disabled) return; csClose.forEach(c => { if (c !== close) c(false); });
    pop.hidden = false; if (pop.showPopover) pop.showPopover(); wrap.classList.add('is-open'); trig.setAttribute('aria-expanded', 'true');
    if (q) { q.value = ''; filter(); } place(); addEventListener('scroll', place, true); addEventListener('resize', place);
    setAct(items.filter((li, i) => opts[i].selected && !li.hidden)[0] || vis()[0]); (q || list).focus();
  };
  const close = back => { if (pop.hidden) return; removeEventListener('scroll', place, true); removeEventListener('resize', place); if (pop.hidePopover) pop.hidePopover(); pop.hidden = true; wrap.classList.remove('is-open'); trig.setAttribute('aria-expanded', 'false'); if (back) trig.focus(); };
  csClose.push(close);
  const choose = li => { if (!li || li.getAttribute('aria-disabled') === 'true') return; const i = +li.dataset.i; if (sel.selectedIndex !== i) { sel.selectedIndex = i; sync(); sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); } close(true); };
  const keys = e => {
    const v = vis(), i = v.indexOf(act), go = { ArrowDown: Math.min(v.length - 1, i + 1), ArrowUp: Math.max(0, i - 1), PageDown: Math.min(v.length - 1, i + 8), PageUp: Math.max(0, i - 8) }[e.key];
    if (go !== undefined) { e.preventDefault(); setAct(v[go]); }
    else if ((e.key === 'Home' || e.key === 'End') && !q) { e.preventDefault(); setAct(e.key === 'Home' ? v[0] : v[v.length - 1]); }
    else if (e.key === 'Enter' || (e.key === ' ' && !q)) { e.preventDefault(); choose(act); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(true); }
    else if (e.key === 'Tab') close(false);
    else if (!q && e.key.length === 1) { const hit = v.filter(li => csNorm(li.textContent).indexOf(csNorm(e.key)) === 0)[0]; if (hit) setAct(hit); }
  };
  trig.addEventListener('click', () => (pop.hidden ? open() : close(true)));
  trig.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(); } });
  (q || list).addEventListener('keydown', keys); if (q) { list.addEventListener('keydown', keys); q.addEventListener('input', filter); }
  list.addEventListener('mousedown', e => e.preventDefault());
  list.addEventListener('click', e => { const li = e.target.closest('.cs__opt'); if (li) choose(li); });
  list.addEventListener('mousemove', e => { const li = e.target.closest('.cs__opt'); if (li && li !== act && li.getAttribute('aria-disabled') !== 'true') setAct(li); });
  wrap.addEventListener('focusout', e => { if (!wrap.contains(e.relatedTarget)) close(false); });
  if (lab) lab.addEventListener('click', e => { if (!wrap.contains(e.target)) { e.preventDefault(); trig.focus(); } });
  sel.addEventListener('change', sync); sel.focus = () => trig.focus();
  sync();
}
const kitSelects = () => $$('select.select:not([data-native])').forEach(kitSelect);
document.addEventListener('pointerdown', e => { if (!e.target.closest('.cs')) csClose.forEach(c => c(false)); });

/* ---------- Отрисовка и привязка ---------- */
let RT = Date.now();
function render() {
  RT = Date.now();
  const page = st.mode === 'list' ? pageList() : st.mode === 'partner' ? pageCabinet() : pageAdmin();
  csClose.forEach(c => c(false)); csClose.length = 0;
  $('#app').innerHTML = shell(page);
  renderDemo(); bindApp(); kitSelects(); tick(); revealStep(); saveSt();
}
/* Путь прокручивается по горизонтали на узких экранах: текущий шаг выводим в видимую часть (прокручиваем сам путь, страницу не двигаем). */
function revealStep() {
  const p = $('#path'), c = p && $('[aria-current="step"]', p);
  if (!c || p.scrollWidth <= p.clientWidth) return;
  p.scrollLeft = c.getBoundingClientRect().left - p.getBoundingClientRect().left + p.scrollLeft - (p.clientWidth - c.offsetWidth) / 2;
}
const STOP_ASK = who => ({ title: 'Остановить расходы?', text: (who === 'partner' ? 'Housebook получит тревогу немедленно. ' : 'Тревога уйдёт немедленно. ') + 'Система сразу поставит кампанию в Meta на паузу. Если пауза не пройдёт, маркетингу придёт красная задача остановить кампанию вручную (срок п. 5.3 договора: 1 рабочий день), а администратору причина. Расходы будут считаться остановленными.', ok: 'Да, остановить расходы', keep: 'Не останавливать', reason: who === 'partner' });
function bindApp() {
  const rail = $('#rail'); if (rail) rail.onclick = () => { st.rail = !st.rail; render(); };
  $$('#path .path__go').forEach(b => { b.onclick = () => setF(+b.getAttribute('data-f')); });
  $$('[data-list]').forEach(a => { a.onclick = () => { st.mode = 'list'; render(); writeHash(); window.scrollTo(0, 0); }; });
  $$('[data-open]').forEach(a => { a.onclick = e => { e.preventDefault(); openPartner(a.getAttribute('data-open')); }; });
  $$('[data-go]').forEach(b => { b.onclick = () => openPartner(b.getAttribute('data-go'), b.getAttribute('data-gorole'), b.getAttribute('data-gotask')); });
  $$('[data-as]').forEach(b => { b.onclick = () => { st.role = b.getAttribute('data-as'); render(); writeHash(); }; });
  $$('[data-nudge]').forEach(b => { b.onclick = () => toast('Напоминание отправлено в Telegram: ' + ROLES[b.getAttribute('data-nudge')].name); });
  const u = $('#unhalt'); if (u) u.onclick = () => { if (st.halt && st.halt.tid) delete st.did[st.halt.tid]; delete st.did['halt.refund']; st.halt = null; render(); };
  $$('[data-task]').forEach(c => {
    const t = taskById(c.getAttribute('data-task')); if (!t) return;
    if (t.bind) t.bind(c);
    $$('[data-k]', c).forEach(b => { b.onclick = () => runTask(t, c, b.getAttribute('data-k')); });
  });
  if (st.focus) { const c = $('[data-task="' + st.focus + '"]'); if (c) { c.open = true; c.scrollIntoView({ block: 'start' }); } st.focus = null; }
  $$('[data-copy]').forEach(b => { b.onclick = () => { copy($('#' + b.getAttribute('data-copy')).value); toast('Ссылка с меткой скопирована', 'ok'); }; });
  const sb = $('#stopBtn'); if (sb) sb.onclick = () => ask(STOP_ASK('staff'), () => { addStop('staff'); toast(st.pauseFail ? 'Пауза в Meta не прошла: маркетингу ушла красная задача, срок отключения идёт' : 'Система поставила кампанию на паузу в Meta', st.pauseFail ? 'warn' : 'ok'); render(); });
  const ps = $('#pStop'); if (ps) ps.onclick = () => ask(STOP_ASK('partner'), () => { addStop('partner'); toast(st.pauseFail ? 'Запрос принят. Пауза в Meta не прошла: маркетингу ушла задача остановить кампанию вручную' : 'Запрос принят. Система поставила кампанию на паузу в Meta', st.pauseFail ? 'warn' : 'ok'); render(); });
  const ss = $('#spSave'); if (ss) ss.onclick = () => {
    const a = num($('#sp').value), c = num($('#rf').value || '0'), e = $('#spE');
    const bad = m => { $('.notice__t', e).textContent = m; e.hidden = false; };
    if (isNaN(a) || isNaN(c) || a < 0 || c < 0) return bad('Суммы вводятся цифрами, не меньше нуля.');
    if (c > a) return bad('Возврат площадки не может быть больше расхода.');
    if (a + reserveOf() - c > st.budget) return bad('Расход с резервом больше бюджета. Проверьте цифры: это перерасход.');
    st.spent = a; st.refund = c; st.manual = true; toast('Расход внесён вручную (исключение)', 'warn'); render();
  };
  $$('details[data-sec]').forEach(d => { d.addEventListener('toggle', () => { st.secOpen[d.getAttribute('data-sec')] = d.open; }); });
  $$('[data-copyid]').forEach(b => { b.onclick = () => { copy(b.getAttribute('data-copyid')); const s = b.nextElementSibling; if (s) s.textContent = 'Скопировано'; }; });
  const fc = $('#fcBtn'); if (fc) fc.onclick = () => { st.did['acc.cycle'] = 1; toast('Первый цикл отмечен завершённым'); render(); };
  const lm = $('#lmBtn'); if (lm) lm.onclick = () => {
    const cur = st.did['acc.limit'] || 4000, n = num($('#lmV').value);
    if (isNaN(n) || n < 4000) return fe('lmE', 'Новый лимит в долларах, не меньше ' + usd(4000) + '.');
    if (n <= cur) return fe('lmE', 'Лимит повышается только вверх: сейчас ' + usd(cur) + '.');
    if (!$('#lmAt').value) return fe('lmE', 'Укажите, когда партнёра уведомили о новом лимите (время по Дубаю).');
    st.did['acc.limit'] = n; toast('Лимит повышен'); render();
  };
  $$('[data-mkpick]').forEach(b => { b.onclick = () => { st.mkPick = b.getAttribute('data-mkpick'); render(); }; });
  const mg = $('#mkGo'); if (mg) mg.onclick = () => { st.mkNext = st.mkPick; st.mkPick = ''; toast('Смена страны запрошена, вступит со следующего периода'); render(); };
  const hs = $('#hrSave'); if (hs) hs.onclick = () => {
    const nv = {}; REQ_FIELDS.forEach(k => { nv[k] = $('#hr-' + k).value.trim(); }); nv.swift = nv.swift.toUpperCase();
    if (nv.swift && !/^[A-Z0-9]{8}([A-Z0-9]{3})?$/.test(nv.swift)) return fe('hrE', 'SWIFT/BIC: 8 или 11 знаков, например ABCDAEAAXXX');
    if (nv.iban && !/^[A-Za-z0-9][A-Za-z0-9 -]{4,}$/.test(nv.iban)) return fe('hrE', 'Номер счёта или IBAN: буквы, цифры, пробелы и дефисы, не меньше 5 знаков');
    if (nv.purpose && nv.purpose.indexOf('{invoice}') < 0) return fe('hrE', 'Шаблон назначения платежа должен содержать {invoice}: по нему финансы находят оплату');
    const ch = REQ_FIELDS.filter(k => nv[k] !== st.hbreq[k]);
    if (ch.length) st.reqLog.push({ t: dt(nowMs()), who: ROLES[st.role].who + (st.role === 'cfo' ? ' (финансовый директор)' : ''), d: ch.map(k => ({ k: k, was: st.hbreq[k], now: nv[k] })) });
    st.hbreq = nv; toast('Сохранено. Полным админам и финдиректору ушло уведомление об изменении.'); render();
  };
  [['lw', 'who'], ['lt', 'type'], ['lf', 'from'], ['lto', 'to']].forEach(p => { const s = $('#' + p[0]); if (s) s.onchange = () => { st.logF[p[1]] = s.value; render(); const t = $('#mp-sec-journal'); if (t) t.scrollIntoView({ block: 'start' }); }; });
}

/* ---------- Таймеры: окно отказа (кадр 24 часа) и срок отключения рекламы ---------- */
let tickBase = null, tickFrame = -1;
function tick() {
  const els = $$('[data-tick]');
  if (!els.length) tickBase = null;
  else if (F[st.f].timer) {
    if (tickFrame !== st.f || tickBase === null) { tickFrame = st.f; tickBase = Date.now(); }
    const left = Math.max(0, F[st.f].timer - Math.floor((Date.now() - tickBase) / 1000)), t = fmtLeft(left);
    els.forEach(e => { e.textContent = t; });
  }
  /* одни часы: «осталось» в таблицах и таймер тревоги считаются от одного момента, плюс прошедшие с отрисовки секунды */
  const el = Date.now() - RT;
  $$('[data-left]').forEach(e => { const left = Math.max(0, Math.floor((+e.getAttribute('data-left') - (+e.getAttribute('data-n0') + el)) / 1000)); e.textContent = left ? fmtLeft(left) : 'срок вышел'; });
  $$('[data-due]').forEach(e => { e.textContent = e.getAttribute('data-pre') + remTxt(+e.getAttribute('data-due') - (+e.getAttribute('data-n0') + el)); });
}
setInterval(tick, 1000);

document.addEventListener('click', e => { const a = e.target.closest('a[href="#"]'); if (a) e.preventDefault(); });
window.addEventListener('hashchange', () => { readHash(); render(); });
function loadAll() { loadSt(); PARTNERS.forEach(p => { if (p.id !== st.pid && !st.store[p.id]) st.store[p.id] = p.sn(); }); }
setupModal(); loadAll(); readHash(); render();
})();
