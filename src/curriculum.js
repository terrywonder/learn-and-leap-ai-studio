/* Original, offline, age-banded questions; 4 subjects, 3 interface languages. */
(function(root){'use strict';
const AGE=['5-6','7-9','10-12','13-15','16+'],SUBJECTS=['math','english','science','general'];
const SUBJECT_LABELS={math:['Mathematics','数学','Matematik'],english:['English','英语','Bahasa Inggeris'],science:['Science','科学','Sains'],general:['General Knowledge','常识','Pengetahuan Am']};
const langIndex={en:0,zh:1,ms:2};function local(tr,lang='en'){return tr?.[langIndex[lang]??0]??tr?.[0]??String(tr)}
function rnd(seed){let v=(seed>>>0)||12345;return()=>((v=(Math.imul(v,1664525)+1013904223)>>>0)/4294967296)}
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function questionMath(age,level,seed){const r=rnd(seed),roll=(a,b)=>a+Math.floor(r()*(b-a+1));let a,b,ans,stem,hint;const difficulty=Math.floor((level-1)/20),k=seed%5;
if(age==='5-6'){
 if(k===0){a=roll(2,7+difficulty);ans=a;stem=[`How many stars? ${'⭐'.repeat(a)}`,`数一数有多少颗星？${'⭐'.repeat(a)}`,`Berapa bintang? ${'⭐'.repeat(a)}`];hint=['Count each star once.','每颗星数一次。','Kira setiap bintang sekali.']}
 else if(k===1){a=roll(1,6+difficulty);b=roll(1,5);ans=a+b;stem=[`${a} + ${b} = ?`,`${a} + ${b} = ?`,`${a} + ${b} = ?`];hint=['Count on from the first number.','从第一个数字往上数。','Sambung kira daripada nombor pertama.']}
 else if(k===2){a=roll(4,10+difficulty);b=roll(1,a-1);ans=a-b;stem=[`${a} − ${b} = ?`,`${a} − ${b} = ?`,`${a} − ${b} = ?`];hint=['Take away the second group.','减去第二组的数量。','Tolak kumpulan kedua.']}
 else if(k===3){a=roll(1,7);ans=a+1;stem=[`What comes after ${a}?`,`在 ${a} 后面的数字是什么？`,`Apakah nombor selepas ${a}?`];hint=['Think of the counting sequence.','想想数数的顺序。','Fikirkan urutan mengira.']}
 else{a=roll(1,5);ans=a+2;stem=[`Complete the pattern: ${a}, ${a+1}, __, ${a+3}`,`完成规律：${a}、${a+1}、__、${a+3}`,`Lengkapkan corak: ${a}, ${a+1}, __, ${a+3}`];hint=['The numbers go up one at a time.','数字每次增加一。','Nombor bertambah satu demi satu.']}
}else if(age==='7-9'){
 a=roll(6,18+difficulty*7);b=roll(2,9+difficulty);
 if(k===0){ans=a+b;stem=[`${a} + ${b} = ?`,`${a} + ${b} = ?`,`${a} + ${b} = ?`]}
 else if(k===1){ans=a-b;stem=[`${a} − ${b} = ?`,`${a} − ${b} = ?`,`${a} − ${b} = ?`]}
 else if(k===2){a=roll(2,8+difficulty);b=roll(2,9);ans=a*b;stem=[`${a} × ${b} = ?`,`${a} × ${b} = ?`,`${a} × ${b} = ?`]}
 else if(k===3){a=roll(3,9);b=roll(2,9);ans=b;stem=[`${a*b} ÷ ${a} = ?`,`${a*b} ÷ ${a} = ?`,`${a*b} ÷ ${a} = ?`]}
 else{a=roll(3,9);b=roll(2,6);ans=a+3*b;stem=[`Continue: ${a}, ${a+b}, ${a+2*b}, ?`,`接着数：${a}、${a+b}、${a+2*b}、？`,`Sambung: ${a}, ${a+b}, ${a+2*b}, ?`]}
 hint=['Use number facts or break the calculation into steps.','可用乘法表或分步计算。','Gunakan fakta nombor atau kira langkah demi langkah.'];
}else if(age==='10-12'){
 a=roll(2,9);b=roll(2,9);
 if(k===0){ans=5*a;stem=[`What is 25% of ${20*a}?`,`求 ${20*a} 的25%。`,`Berapakah 25% daripada ${20*a}?`]}
 else if(k===1){ans=a+b;stem=[`Find x: x − ${b} = ${a}`,`求 x：x − ${b} = ${a}`,`Cari x: x − ${b} = ${a}`]}
 else if(k===2){ans=(a+b)/10;stem=[`${(a/10).toFixed(1)} + ${(b/10).toFixed(1)} = ?`,`${(a/10).toFixed(1)} + ${(b/10).toFixed(1)} = ?`,`${(a/10).toFixed(1)} + ${(b/10).toFixed(1)} = ?`]}
 else if(k===3){ans=a*b;stem=[`A rectangle is ${a} cm by ${b} cm. Area (cm²)?`,`长方形长${a}厘米，宽${b}厘米。面积（cm²）？`,`Segi empat tepat ${a} cm × ${b} cm. Luas (cm²)?`]}
 else{ans=a+b;stem=[`How many tenths are ${a}/10 + ${b}/10?`,`${a}/10 + ${b}/10 一共有多少个十分之一？`,`Berapakah bilangan persepuluh dalam ${a}/10 + ${b}/10?`];ans=a+b;}
 hint=['Pay attention to place value, the operation, and units.','注意位值、运算顺序和单位。','Perhatikan nilai tempat, operasi dan unit.'];
}else if(age==='13-15'){
 a=roll(2,9);b=roll(2,15);const x=roll(-4,13);
 if(k===0){ans=x;stem=[`Solve: ${a}x + ${b} = ${a*x+b}`,`解方程：${a}x + ${b} = ${a*x+b}`,`Selesaikan: ${a}x + ${b} = ${a*x+b}`]}
 else if(k===1){ans=a*a+b;stem=[`${a}² + ${b} = ?`,`${a}² + ${b} = ?`,`${a}² + ${b} = ?`]}
 else if(k===2){ans=a+b;stem=[`Solve: 2x = ${2*(a+b)}`,`解方程：2x = ${2*(a+b)}`,`Selesaikan: 2x = ${2*(a+b)}`]}
 else if(k===3){ans=(3*a);stem=[`A triangle has base ${a} cm and height 6 cm. Area (cm²)?`,`三角形底${a}厘米，高6厘米。面积（cm²）？`,`Segi tiga bertapak ${a} cm dan tinggi 6 cm. Luas (cm²)?`]}
 else{ans=a;stem=[`Find the smaller root: (x − ${a})(x − ${a+b}) = 0`,`求较小的根：(x − ${a})(x − ${a+b}) = 0`,`Cari punca lebih kecil: (x − ${a})(x − ${a+b}) = 0`]}
 hint=['Write down the relevant equation before working it out.','先写出对应方程，再计算。','Tulis persamaan yang berkaitan sebelum mengira.'];
}else{
 a=roll(2,8);b=roll(2,6);const x=roll(1,6);
 if(k===0){ans=2*a*x;stem=[`If f(x) = ${a}x² + ${b}, what is f′(${x})?`,`若 f(x) = ${a}x² + ${b}，求 f′(${x})。`,`Jika f(x) = ${a}x² + ${b}, berapakah f′(${x})?`]}
 else if(k===1){ans=b;stem=[`Evaluate log₂(${2**b}).`,`求 log₂(${2**b})。`,`Nilai log₂(${2**b}).`]}
 else if(k===2){ans=a*(a-1)/2;stem=[`Choose 2 people from ${a}. How many unordered pairs?`,`从${a}人选2人，不计顺序有多少种组合？`,`Pilih 2 daripada ${a} orang. Berapa pasangan tanpa susunan?`]}
 else if(k===3){ans=a+b;stem=[`Solve: 3x − ${3*b} = ${3*a}`,`解方程：3x − ${3*b} = ${3*a}`,`Selesaikan: 3x − ${3*b} = ${3*a}`]}
 else{ans=a*x**2;stem=[`Evaluate f(${x}) if f(t) = ${a}t².`,`若 f(t) = ${a}t²，求 f(${x})。`,`Nilai f(${x}) jika f(t) = ${a}t².`]}
 hint=['Recall the relevant algebraic rule or definition.','回想相关代数法则或定义。','Ingat peraturan atau takrif algebra yang berkaitan.'];
}
// Distinct, plausible numeric distractors; exactly one correct option.
const deltas=[1,-1,2,-2,3,-3,5,-5,10,-10];let options=[ans];for(const d of deltas){const candidate=Math.round((ans+d)*10)/10;if(candidate!==ans&&!options.includes(candidate)&&((age==='5-6'||age==='7-9')?candidate>=0:true))options.push(candidate);if(options.length===4)break}while(options.length<4)options.push(ans+options.length*7);const shuffle=rnd(seed*3+53);for(let i=options.length-1;i>0;i--){let j=Math.floor(shuffle()*(i+1));[options[i],options[j]]=[options[j],options[i]]}
const fmt=x=>Number.isInteger(x)?String(x):Number(x.toFixed(3)).toString();return{stem,options:options.map(o=>[fmt(o),fmt(o),fmt(o)]),correct:options.indexOf(ans),hint,explanation:[`The answer is ${fmt(ans)}.`,`答案是 ${fmt(ans)}。`,`Jawapannya ialah ${fmt(ans)}.`]}
}
// All entries are local-language prompts and choices. The English subject intentionally tests English words in every locale.
const BANK={english:{},science:{},general:{}};
function add(sub,age,en,zh,ms,o1,o2,o3,correct,hint){const opts=(s)=>s.split('|');(BANK[sub][age]??=[]).push({stem:[en,zh,ms],options:[opts(o1),opts(o2),opts(o3)].reduce((arr,list,lang)=>{list.forEach((v,i)=>{if(!arr[i])arr[i]=[];arr[i][lang]=v});return arr},[]),correct,hint:[hint,sub==='english'?'想一想正确的英文用法或意思。':'从题目中的关键词寻找线索。',sub==='english'?'Fikirkan penggunaan atau makna perkataan Inggeris.':'Cari petunjuk dalam kata kunci soalan.']})}
// English grammar/vocabulary, each option stays in English to test English knowledge.
const ENG={
'5-6':[
['Which word names an animal?','哪个英文单词是动物？','Perkataan Inggeris yang manakah haiwan?','cat|chair|cup|car',0,'Think about something alive.'],
['Which word names a colour?','哪个英文单词是颜色？','Perkataan Inggeris yang manakah warna?','run|red|rain|road',1,'Look for a describing word for colours.'],
['Choose the rhyming word for “cat”.','选出与 cat 押韵的单词。','Pilih perkataan yang berima dengan “cat”.','dog|sun|hat|pen',2,'Say the ending sound aloud.'],
['Complete: I ___ happy.','填空：I ___ happy.','Lengkapkan: I ___ happy.','is|are|be|am',3,'Choose the verb that agrees with I.'],
['Which word means a place to learn?','哪个单词表示学习的地方？','Perkataan manakah tempat untuk belajar?','school|spoon|shirt|sheep',0,'Think of a classroom.'],
['Which word means more than one “book”?','book 的复数是什么？','Apakah bentuk jamak “book”?','bookes|books|booking|booked',1,'Most regular plurals add one letter.'] ],
'7-9':[
['Which sentence uses a capital letter correctly?','哪个句子的大写字母正确？','Ayat manakah menggunakan huruf besar dengan betul?','i like apples.|I like apples.|i Like apples.|I Like Apples.',1,'Sentences begin with a capital letter.'],
['Complete: She ___ to school every day.','填空：She ___ to school every day.','Lengkapkan: She ___ to school every day.','go|going|goes|gone',2,'Use the present simple with she.'],
['Which is the opposite of “early”?','early 的反义词是什么？','Apakah lawan bagi “early”?','late|quick|soon|small',0,'Think about arrival times.'],
['Choose the correct plural of “child”.','child 的正确复数是什么？','Pilih bentuk jamak “child”.','childs|childes|childrens|children',3,'This noun has an irregular plural.'],
['Choose the adjective: The ___ bird sings.','填入形容词：The ___ bird sings.','Pilih kata sifat: The ___ bird sings.','slowly|blue|sings|fly',1,'An adjective describes a noun.'],
['Which punctuation ends a question?','问句结尾使用哪一种标点？','Tanda baca yang manakah mengakhiri soalan?','.|,|?|!',2,'Think of a sentence that asks something.'] ],
'10-12':[
['Choose the correct sentence.','选出正确英文句子。','Pilih ayat yang betul.','He have two dogs.|He has two dogs.|He having two dogs.|He haves two dogs.',1,'Match the verb to a singular subject.'],
['Choose the synonym of “brief”.','brief 的近义词是什么？','Pilih sinonim “brief”.','long|loud|short|bright',2,'Think about length rather than volume.'],
['Which sentence is in the past continuous tense?','哪个句子用了过去进行时？','Ayat manakah dalam past continuous?','I was reading.|I read now.|I will read.|I have read.',0,'Look for a past form of be followed by -ing.'],
['Complete: Neither of the answers ___ correct.','填空：Neither of the answers ___ correct.','Lengkapkan: Neither of the answers ___ correct.','are|were|be|is',3,'Neither usually takes a singular verb in formal English.'],
['What is the prefix in “unhappy”?','unhappy 的前缀是什么？','Apakah awalan bagi “unhappy”?','happy|un|py|happ',1,'A prefix comes before the root word.'],
['Choose the correct possessive: the bag belonging to Maya.','表示 Maya 的包，正确写法是什么？','Pilih milikan yang betul bagi beg Maya.','Mayas bag|Maya bag|Maya’s bag|Mayas’ bag',2,'A singular proper name usually takes apostrophe + s.'] ],
'13-15':[
['Which is a complex sentence?','哪个是复合从属句（complex sentence）？','Yang manakah ayat kompleks?','Although it rained, we played.|The sun rose and birds sang.|Run quickly.|The red and blue flags waved.',0,'Look for a dependent clause.'],
['Choose the most precise synonym of “mitigate”.','mitigate 最准确的近义词是什么？','Pilih sinonim paling tepat untuk “mitigate”.','intensify|alleviate|predict|ignore',1,'The word describes reducing severity.'],
['Which is in the passive voice?','哪个句子是被动语态？','Yang manakah ayat pasif?','The chef baked bread.|The child ran.|The bread was baked by the chef.|She will bake.',2,'The object receives the action.'],
['Choose the correct conditional: If I ___ earlier, I would have caught the train.','选择正确条件句：If I ___ earlier, I would have caught the train.','Pilih ayat bersyarat: If I ___ earlier, I would have caught the train.','leave|left|would leave|had left',3,'A past unreal condition uses the past perfect.'],
['Which word is an adverb?','哪个单词是副词？','Perkataan manakah kata adverba?','quickly|bright|bravery|run',0,'Adverbs often describe how an action happens.'],
['Which is an example of alliteration?','哪个是头韵（alliteration）的例子？','Yang manakah aliterasi?','The sky is blue.|Silver snakes slither.|Time flies.|A mountain of work.',1,'Notice repeating initial consonant sounds.'] ],
'16+':[
['Which word best describes an argument supported by valid reasoning?','哪个单词最适合形容推理有效的论证？','Perkataan mana menggambarkan hujah berasaskan penaakulan sah?','ambiguous|circular|sound|arbitrary',2,'Think about logic and the truth of premises.'],
['Which is the correct subjunctive form?','哪个是正确的虚拟语气形式？','Manakah bentuk subjunktif yang betul?','If I was you, I would go.|If I were you, I would go.|If I am you, I would go.|If I be you, I would go.',1,'Formal hypothetical situations use a special form of be.'],
['Choose the best transition signalling contrast.','选出最能表示转折的连接词。','Pilih peralihan yang menunjukkan pertentangan.','Furthermore|Therefore|Similarly|Nevertheless',3,'The relationship is opposition, not addition.'],
['Which phrase contains a dangling modifier?','哪个短语所在句子有悬垂修饰语？','Ayat manakah mengandungi pengubah tergantung?','Walking to school, the rain began.|Walking to school, I saw rain.|I walked to school in rain.|As I walked, it rained.',0,'Ask who performs the introductory action.'],
['Which word is closest to “ubiquitous”?','ubiquitous 的近义词是什么？','Apakah sinonim “ubiquitous”?','rare|pervasive|fragile|temporary',1,'Think of something found in many places.'],
['Choose the parallel construction.','选出并列结构一致的句子。','Pilih struktur selari.','She likes running, to swim, and cycling.|She likes to run, swimming, and to cycle.|She likes running, swimming, and cycling.|She likes run, swim, and cycling.',2,'Items in a series should have matching grammatical forms.'] ]};
for(const [age,rows] of Object.entries(ENG))for(const [en,zh,ms,opts,correct,hint] of rows)add('english',age,en,zh,ms,opts,opts,opts,correct,hint);
// Science banks: options are translated individually; answer indices are explicit and verified.
const SCI={
'5-6':[
['Which body part helps us hear?','我们用哪个身体部位听声音？','Bahagian badan manakah membantu kita mendengar?','Nose|Ears|Feet|Fingers','鼻子|耳朵|脚|手指','Hidung|Telinga|Kaki|Jari',1],
['What do plants need to grow?','植物生长需要什么？','Apakah yang tumbuhan perlukan untuk hidup?','Plastic|Smoke|Water|Sand only','塑料|烟|水|只有沙','Plastik|Asap|Air|Pasir sahaja',2],
['Which animal usually lays eggs?','哪种动物通常会下蛋？','Haiwan manakah biasanya bertelur?','Chicken|Cow|Cat|Dog','鸡|牛|猫|狗','Ayam|Lembu|Kucing|Anjing',0],
['What lights up our day?','白天主要是什么照亮地球？','Apakah yang menerangi siang hari?','Moon|Stars alone|Torch|Sun','月亮|只有星星|手电筒|太阳','Bulan|Bintang sahaja|Lampu suluh|Matahari',3],
['Which material is attracted to a magnet?','哪种材料通常会被磁铁吸引？','Bahan manakah ditarik oleh magnet?','Wood|Iron|Paper|Plastic','木头|铁|纸|塑料','Kayu|Besi|Kertas|Plastik',1],
['What can melt into water?','什么东西能融化成水？','Apakah yang boleh mencair menjadi air?','Stone|Leaf|Ice|Glass','石头|叶子|冰|玻璃','Batu|Daun|Ais|Kaca',2]],
'7-9':[
['What do roots mainly absorb from soil?','植物的根主要从土壤吸收什么？','Apakah yang akar serap daripada tanah?','Water|Sunlight|Sound|Wind','水|阳光|声音|风','Air|Cahaya matahari|Bunyi|Angin',0],
['Which planet is closest to the Sun?','离太阳最近的行星是？','Planet manakah paling dekat dengan Matahari?','Venus|Earth|Mars|Mercury','金星|地球|火星|水星','Zuhrah|Bumi|Marikh|Utarid',3],
['When liquid water freezes, it becomes...','液态水结冰后变成什么？','Apabila air membeku, ia menjadi...','Steam|Ice|Smoke|Air','水蒸气|冰|烟|空气','Wap|Ais|Asap|Udara',1],
['Which organ pumps blood around the body?','哪个器官把血液泵向全身？','Organ manakah mengepam darah ke seluruh badan?','Stomach|Lungs|Heart|Kidneys','胃|肺|心脏|肾脏','Perut|Paru-paru|Jantung|Buah pinggang',2],
['Which is a source of renewable energy?','哪一个是可再生能源？','Yang manakah sumber tenaga boleh baharu?','Sunlight|Coal|Petrol|Natural gas','阳光|煤炭|汽油|天然气','Cahaya matahari|Arang batu|Petrol|Gas asli',0],
['What gas do people breathe in to survive?','人类生存需要吸入哪种气体？','Gas manakah diperlukan manusia untuk hidup?','Helium|Methane|Carbon monoxide|Oxygen','氦气|甲烷|一氧化碳|氧气','Helium|Metana|Karbon monoksida|Oksigen',3]],
'10-12':[
['Which structure is the basic unit of life?','生命的基本单位是什么？','Apakah unit asas kehidupan?','Tissue|Cell|Organ|System','组织|细胞|器官|系统','Tisu|Sel|Organ|Sistem',1],
['What force pulls objects toward Earth?','什么力使物体向地球下落？','Daya apakah menarik objek ke Bumi?','Friction|Magnetism|Gravity|Buoyancy','摩擦力|磁力|重力|浮力','Geseran|Kemagnetan|Graviti|Keapungan',2],
['What is the chemical formula of water?','水的化学式是什么？','Apakah formula kimia bagi air?','H₂O|CO₂|O₂|NaCl','H₂O|CO₂|O₂|NaCl','H₂O|CO₂|O₂|NaCl',0],
['Which process helps plants make sugar using light?','植物利用光制造糖的过程叫什么？','Proses manakah membantu tumbuhan menghasilkan gula menggunakan cahaya?','Respiration|Evaporation|Condensation|Photosynthesis','呼吸作用|蒸发|凝结|光合作用','Respirasi|Penyejatan|Pemeluwapan|Fotosintesis',3],
['Which particle has a negative electric charge?','哪种粒子带负电荷？','Zarah manakah mempunyai cas elektrik negatif?','Proton|Electron|Neutron|Nucleus','质子|电子|中子|原子核','Proton|Elektron|Neutron|Nukleus',1],
['Which instrument measures temperature?','哪个仪器测量温度？','Alat manakah mengukur suhu?','Ruler|Compass|Thermometer|Balance','尺|指南针|温度计|天平','Pembaris|Kompas|Termometer|Neraca',2]],
'13-15':[
['What is the pH of a neutral aqueous solution at 25°C?','25°C 时中性水溶液的pH是多少？','Apakah pH larutan akueus neutral pada 25°C?','7|3|10|14','7|3|10|14','7|3|10|14',0],
['Which cell organelle produces most ATP during aerobic respiration?','有氧呼吸时哪个细胞器产生大部分ATP？','Organel manakah menghasilkan kebanyakan ATP semasa respirasi aerob?','Nucleus|Ribosome|Golgi apparatus|Mitochondrion','细胞核|核糖体|高尔基体|线粒体','Nukleus|Ribosom|Jasad Golgi|Mitokondrion',3],
['In a series circuit, which quantity is the same through every component?','串联电路中哪个量经过所有元件时相同？','Dalam litar siri, kuantiti manakah sama pada setiap komponen?','Voltage|Current|Resistance|Power','电压|电流|电阻|功率','Voltan|Arus|Rintangan|Kuasa',1],
['Which quantity has the SI unit newton?','哪个物理量的SI单位是牛顿？','Kuantiti manakah mempunyai unit SI newton?','Energy|Pressure|Force|Power','能量|压强|力|功率','Tenaga|Tekanan|Daya|Kuasa',2],
['What is formed when an acid reacts with a base in neutralisation?','酸与碱中和反应通常生成什么？','Apakah yang terbentuk apabila asid bertindak balas dengan bes?','Salt and water|Only oxygen|Only hydrogen|Only carbon','盐和水|只有氧气|只有氢气|只有碳','Garam dan air|Oksigen sahaja|Hidrogen sahaja|Karbon sahaja',0],
['Which describes Newton’s third law?','哪一项描述牛顿第三定律？','Yang manakah menerangkan hukum Newton ketiga?','Energy is conserved|Objects always stop|Mass equals volume|Forces come in equal and opposite pairs','能量守恒|物体必会停止|质量等于体积|作用力与反作用力大小相等方向相反','Tenaga terabadi|Objek sentiasa berhenti|Jisim sama isipadu|Daya berpasangan sama besar dan bertentangan',3]],
'16+':[
['What does a catalyst change in a chemical reaction?','催化剂在化学反应中改变什么？','Apakah yang diubah pemangkin dalam tindak balas kimia?','Equilibrium constant|Activation energy|Conservation of mass|Atomic number','平衡常数|活化能|质量守恒|原子序数','Pemalar keseimbangan|Tenaga pengaktifan|Keabadian jisim|Nombor atom',1],
['In DNA, adenine pairs with which base?','DNA中腺嘌呤与哪种碱基配对？','Dalam DNA, adenina berpasangan dengan bes yang mana?','Cytosine|Guanine|Thymine|Uracil','胞嘧啶|鸟嘌呤|胸腺嘧啶|尿嘧啶','Sitosina|Guanina|Timina|Urasil',2],
['Which law states entropy of an isolated system does not decrease?','哪条定律指出孤立系统的熵不会减少？','Hukum manakah menyatakan entropi sistem terasing tidak berkurang?','Second law of thermodynamics|Ohm’s law|Boyle’s law|Hooke’s law','热力学第二定律|欧姆定律|波义耳定律|胡克定律','Hukum termodinamik kedua|Hukum Ohm|Hukum Boyle|Hukum Hooke',0],
['For a convex lens, rays parallel to the principal axis converge at the...','对于凸透镜，平行主轴的光线会汇聚于哪里？','Bagi kanta cembung, sinar selari paksi utama bertemu di...','Optical centre|Lens edge|Object plane|Principal focus','光心|透镜边缘|物平面|主焦点','Pusat optik|Pinggir kanta|Satah objek|Fokus utama',3],
['What is oxidation defined as in terms of electrons?','从电子角度看，什么是氧化？','Apakah pengoksidaan dari segi elektron?','Gaining electrons|Losing electrons|Gaining neutrons|Losing protons','得到电子|失去电子|得到中子|失去质子','Menerima elektron|Kehilangan elektron|Menerima neutron|Kehilangan proton',1],
['Which is a necessary condition for natural selection to cause evolution?','自然选择导致演化需要什么条件？','Apakah syarat perlu agar pemilihan semula jadi menyebabkan evolusi?','Every trait is identical|All organisms survive|Heritable variation|No reproduction','所有性状相同|所有个体存活|可遗传变异|不繁殖','Semua ciri serupa|Semua organisma hidup|Variasi yang diwarisi|Tiada pembiakan',2]]};
const GK={
'5-6':[
['Which day comes after Monday?','星期一之后是哪一天？','Hari apakah selepas Isnin?','Friday|Tuesday|Sunday|Saturday','星期五|星期二|星期日|星期六','Jumaat|Selasa|Ahad|Sabtu',1],
['Which vehicle travels on railway tracks?','哪种交通工具在铁轨上行驶？','Kenderaan manakah bergerak di atas landasan?','Train|Boat|Aeroplane|Bicycle','火车|船|飞机|自行车','Kereta api|Bot|Kapal terbang|Basikal',0],
['Which place is for borrowing books?','在哪里可以借书？','Di manakah boleh meminjam buku?','Market|Kitchen|Airport|Library','市场|厨房|机场|图书馆','Pasar|Dapur|Lapangan terbang|Perpustakaan',3],
['What colour do traffic lights commonly show to mean stop?','交通灯通常用什么颜色表示停止？','Warna lampu isyarat yang bermaksud berhenti?','Green|Blue|Red|Yellow','绿|蓝|红|黄','Hijau|Biru|Merah|Kuning',2],
['Which object helps you stay dry in rain?','下雨时哪种物品帮助你保持干爽？','Objek manakah membantu anda kekal kering ketika hujan?','Notebook|Umbrella|Pencil|Spoon','笔记本|雨伞|铅笔|汤匙','Buku nota|Payung|Pensel|Sudu',1],
['Which meal usually happens in the morning?','通常在早上吃哪一餐？','Makanan manakah biasanya dimakan pada waktu pagi?','Breakfast|Dinner|Supper|Midnight snack','早餐|晚餐|宵夜|午夜点心','Sarapan|Makan malam|Makan lewat malam|Snek tengah malam',0]],
'7-9':[
['What is the capital city of Malaysia?','马来西亚的首都是什么？','Apakah ibu negara Malaysia?','George Town|Ipoh|Kuala Lumpur|Johor Bahru','乔治市|怡保|吉隆坡|新山','George Town|Ipoh|Kuala Lumpur|Johor Bahru',2],
['Which ocean is the largest on Earth?','地球上最大的海洋是？','Lautan manakah terbesar di Bumi?','Pacific|Indian|Arctic|Atlantic','太平洋|印度洋|北冰洋|大西洋','Pasifik|Hindi|Artik|Atlantik',0],
['Which country is famous for the Eiffel Tower?','埃菲尔铁塔位于哪个国家？','Negara manakah terkenal dengan Menara Eiffel?','Italy|Spain|Germany|France','意大利|西班牙|德国|法国','Itali|Sepanyol|Jerman|Perancis',3],
['How many continents are there in the commonly taught seven-continent model?','常见的七大洲划分法有多少个洲？','Berapa benua dalam model tujuh benua yang lazim diajar?','Five|Seven|Six|Eight','五|七|六|八','Lima|Tujuh|Enam|Lapan',1],
['Which direction is opposite north?','北方的相反方向是？','Arah manakah bertentangan dengan utara?','East|West|South|Northeast','东|西|南|东北','Timur|Barat|Selatan|Timur laut',2],
['Which country has the city of Tokyo?','东京位于哪个国家？','Tokyo terletak di negara mana?','Japan|Thailand|South Korea|China','日本|泰国|韩国|中国','Jepun|Thailand|Korea Selatan|China',0]],
'10-12':[
['Which line divides Earth into Northern and Southern Hemispheres?','哪条线把地球分为南北半球？','Garisan manakah membahagikan Bumi kepada hemisfera utara dan selatan?','Prime Meridian|Tropic of Cancer|Arctic Circle|Equator','本初子午线|北回归线|北极圈|赤道','Meridian Pangkal|Garisan Sartan|Bulatan Artik|Khatulistiwa',3],
['What does UNESCO stand for?','UNESCO是哪一个组织的英文缩写？','Apakah kepanjangan UNESCO?','United Nations Economic Security Council|United Nations Educational, Scientific and Cultural Organization|Universal National Education Council|Union of New Education Societies','联合国经济安全理事会|联合国教育、科学及文化组织|世界国家教育委员会|新教育学会联盟','Majlis Keselamatan Ekonomi PBB|Pertubuhan Pendidikan, Sains dan Kebudayaan PBB|Majlis Pendidikan Kebangsaan Sejagat|Kesatuan Persatuan Pendidikan Baharu',1],
['Which is a primary source for studying a historical event?','研究历史事件时哪项属于第一手资料？','Yang manakah sumber primer untuk mengkaji peristiwa sejarah?','Recent textbook summary|A modern blog retelling|A diary written during the event|An encyclopedia article','现代课本总结|现代博客复述|事件当时写的日记|百科文章','Ringkasan buku teks baharu|Penceritaan blog moden|Diari ketika peristiwa berlaku|Artikel ensiklopedia',2],
['Which country shares the island of Borneo with Malaysia and Brunei?','哪个国家与马来西亚和文莱共享婆罗洲岛？','Negara manakah berkongsi pulau Borneo dengan Malaysia dan Brunei?','Indonesia|Philippines|Thailand|Vietnam','印度尼西亚|菲律宾|泰国|越南','Indonesia|Filipina|Thailand|Vietnam',0],
['Which device converts sunlight directly into electricity?','哪个设备把阳光直接转换为电能？','Alat manakah menukar cahaya matahari terus kepada elektrik?','Wind turbine|Hydroelectric dam|Diesel generator|Solar photovoltaic panel','风力涡轮机|水力发电坝|柴油发电机|太阳能光伏板','Turbin angin|Empangan hidroelektrik|Penjana diesel|Panel fotovolta suria',3],
['Which is the largest desert by area on Earth?','按面积计算，地球上最大的沙漠是？','Gurun manakah terbesar mengikut keluasan di Bumi?','Sahara|Antarctic Desert|Gobi|Arabian Desert','撒哈拉沙漠|南极沙漠|戈壁沙漠|阿拉伯沙漠','Sahara|Gurun Antartika|Gobi|Gurun Arab',1]],
'13-15':[
['What is a strong password practice?','哪种密码习惯较安全？','Yang manakah amalan kata laluan kukuh?','Use a unique long passphrase|Reuse one short password|Share passwords with friends|Write passwords publicly','使用独特且较长的密码短语|重复使用一个短密码|分享密码给朋友|公开写出密码','Gunakan frasa laluan panjang dan unik|Guna semula kata laluan pendek|Kongsi kata laluan|Tulis kata laluan secara terbuka',0],
['Which statement about correlation is correct?','哪一项关于相关性是正确的？','Pernyataan yang betul tentang korelasi?','It always proves causation|It requires two identical variables|It measures only averages|It does not by itself prove causation','一定能证明因果|要求两变量相同|只测平均值|本身不足以证明因果','Sentiasa bukti sebab-akibat|Perlu pemboleh ubah sama|Hanya ukur purata|Tidak sendiri membuktikan sebab-akibat',3],
['Which event began in 1789?','哪项历史事件始于1789年？','Peristiwa sejarah manakah bermula pada 1789?','World War I|French Revolution|Cold War|Renaissance','第一次世界大战|法国大革命|冷战|文艺复兴','Perang Dunia I|Revolusi Perancis|Perang Dingin|Renaissance',1],
['Which country straddles Europe and Asia?','哪个国家横跨欧洲和亚洲？','Negara manakah terletak di Eropah dan Asia?','Portugal|Iceland|Türkiye|Ireland','葡萄牙|冰岛|土耳其|爱尔兰','Portugal|Iceland|Türkiye|Ireland',2],
['When checking a viral claim, what is a good first step?','查证网络流言时，好的第一步是什么？','Apakah langkah awal yang baik menyemak dakwaan tular?','Check original sources and dates|Share it immediately|Trust the headline only|Ignore all evidence','核对原始来源和日期|立即转发|只看标题|忽略证据','Semak sumber asal dan tarikh|Terus kongsi|Percayakan tajuk sahaja|Abaikan bukti',0],
['What is an opportunity cost?','什么是机会成本？','Apakah kos lepas?','Total money in a bank|A government tax|The cost of every option together|The value of the next-best alternative forgone','银行全部存款|政府税收|所有选项的总成本|放弃的次佳选择的价值','Jumlah simpanan bank|Cukai kerajaan|Kos semua pilihan|Nilai alternatif terbaik seterusnya yang dilepaskan',3]],
'16+':[
['Which sample is more likely to be representative of a population?','哪种样本更有可能代表总体？','Sampel manakah lebih mewakili populasi?','Only volunteers from one club|A well-designed random sample|Only the first ten replies|Only one age group','同一俱乐部的自愿者|设计良好的随机样本|最早十位回复者|只有一个年龄组','Sukarelawan sebuah kelab|Sampel rawak dirancang baik|Sepuluh respons pertama|Satu kumpulan umur',1],
['Which concept explains a rising general price level over time?','什么概念表示总体物价持续上涨？','Konsep manakah menerangkan kenaikan aras harga umum dari semasa ke semasa?','Deflation|Barter|Inflation|Depreciation of every asset','通缩|以物易物|通胀|所有资产贬值','Deflasi|Barter|Inflasi|Susut nilai setiap aset',2],
['Which organisation primarily sets international civil aviation standards?','哪个组织主要制定国际民航标准？','Organisasi manakah terutamanya menetapkan piawaian penerbangan awam antarabangsa?','ICAO|WHO|WTO|IMF','国际民航组织|世界卫生组织|世界贸易组织|国际货币基金组织','ICAO|WHO|WTO|IMF',0],
['A sound deductive argument must be...','一个健全的演绎论证必须符合什么条件？','Hujah deduktif yang kukuh mestilah...','Popular and persuasive|Short and emotional|Based only on a conclusion|Valid with true premises','受欢迎且有说服力|简短而情绪化|只有结论|推理有效且前提真实','Popular dan memujuk|Pendek dan emosi|Berdasarkan kesimpulan sahaja|Sah dengan premis benar',3],
['What is the median of the dataset 2, 5, 9, 14, 21?','数据2、5、9、14、21的中位数是什么？','Apakah median data 2, 5, 9, 14, 21?','5|9|10|14','5|9|10|14','5|9|10|14',1],
['Which practice best mitigates confirmation bias in research?','研究时哪种做法最能减少确认偏误？','Amalan manakah paling baik mengurangkan bias pengesahan dalam kajian?','Ignore contrary results|Only publish agreement|Actively test competing explanations|Choose evidence after deciding','忽略反例|只发布支持结果|主动检验竞争解释|先决定再挑证据','Abaikan keputusan bertentangan|Terbit hanya persetujuan|Uji penjelasan alternatif|Pilih bukti selepas putuskan',2]]};
for(const [age,rows] of Object.entries(SCI))for(const [en,zh,ms,o1,o2,o3,c] of rows)add('science',age,en,zh,ms,o1,o2,o3,c,'Think about how the natural world works.');
for(const [age,rows] of Object.entries(GK))for(const [en,zh,ms,o1,o2,o3,c] of rows)add('general',age,en,zh,ms,o1,o2,o3,c,'Use the context and compare the choices carefully.');
function makeQuestion({age='10-12',subject='math',level=1,slot=0,attempt=0,lang='en'}){if(!AGE.includes(age)||!SUBJECTS.includes(subject)||!Number.isInteger(level)||level<1||level>100)throw Error('Invalid question settings');const seed=(level*1013+slot*3137+attempt*761+AGE.indexOf(age)*6113+SUBJECTS.indexOf(subject)*2111)>>>0;const bank=subject==='math'?questionMath(age,level,seed):BANK[subject][age][(level*3+slot*7+attempt*5)%BANK[subject][age].length];return{id:`${age}-${subject}-${level}-${slot}-${attempt}`,subject,age,prompt:local(bank.stem,lang),options:bank.options.map(x=>local(x,lang)),correct:bank.correct,hint:local(bank.hint,lang),explanation:bank.explanation?local(bank.explanation,lang):local(['Think about the key fact, then try another challenge.','理解关键知识点，再挑战下一题。','Fikirkan fakta penting, kemudian cuba cabaran seterusnya.'],lang)}}
root.LearnCurriculum={AGE,SUBJECTS,SUBJECT_LABELS,local,makeQuestion,banks:BANK};if(typeof module!=='undefined')module.exports=root.LearnCurriculum;
})(typeof window==='undefined'?globalThis:window);
