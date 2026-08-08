export interface Product {
  id: string;
  slug: string;
  title: string;
  persianTitle: string;
  description: string;
  fullDescription: string;
  price: number;
  discountedPrice?: number;
  image: string;
  images: string[];
  players: string;
  time: string;
  age: string;
  category: string;
  tags: string[];
  stockCount: number;
  rating: number;
  reviewsCount: number;
  weight: number;
  dimensions: string;
  publisher: string;
  releaseYear: number;
}

export const productList: Product[] = [
  {
    id: "catan",
    slug: "catan",
    title: "Catan",
    persianTitle: "کاتان",
    description:
      "بازی استراتژیک و خانوادگی برای ساخت شهرها و جاده‌ها در جزیره کاتان. منابع جمع‌آوری کنید، تجارت کنید و برنده شوید!",
    fullDescription:
      "کاتان یکی از محبوب‌ترین و تأثیرگذارترین بازی‌های رومیزی تاریخ است. در این بازی شما به همراه دوستان خود به جزیره‌ای ناشناخته پا می‌گذارید و با جمع‌آوری منابعی مانند چوب، آجر، گندم، سنگ و پشم، شروع به ساختن جاده‌ها، شهرها و شهرک‌ها می‌کنید. هر بار که تاس می‌ریزید، منابع جدیدی تولید می‌شود و شما باید با تجارت هوشمندانه و استراتژی دقیق، سریع‌تر از رقبا توسعه پیدا کنید. کاتان با قوانین نسبتاً ساده اما عمق استراتژیک بالا، برای بازیکنان مبتدی و حرفه‌ای gleichermaßen جذاب است. این بازی برندهٔ جایزهٔ معتبر Spiel des Jahres (بازی سال آلمان) در سال ۱۹۹۵ شد و تاکنون میلیون‌ها نسخه از آن در سراسر جهان به فروش رفته است.",
    price: 1800000,
    discountedPrice: 1350000,
    image: "/images/products/catan.jpg",
    images: [
      "/images/products/catan-1.jpg",
      "/images/products/catan-2.jpg",
      "/images/products/catan-3.jpg",
    ],
    players: "۳-۴",
    time: "۶۰-۱۲۰",
    age: "+۱۰",
    category: "family",
    tags: ["استراتژیک", "خانوادگی", "تجاری"],
    stockCount: 5,
    rating: 4.8,
    reviewsCount: 256,
    weight: 1200,
    dimensions: "۳۰ × ۲۲ × ۷ سانتی‌متر",
    publisher: "Catan Studio",
    releaseYear: 1995,
  },
  {
    id: "ticket-to-ride",
    slug: "ticket-to-ride",
    title: "Ticket to Ride",
    persianTitle: "بلیط سفر",
    description:
      "سفر با قطار در سراسر آمریکا! مسیرهای ریلی بسازید، مقاصد مخفی خود را کامل کنید و امتیاز بگیرید.",
    fullDescription:
      "بلیط سفر یک بازی خانوادگی و جذاب است که شما را به دوران طلایی راه‌آهن در آمریکای شمالی می‌برد. در این بازی هر بازیکن کارت‌های مقصد مخفی دریافت می‌کند که شهرهای مختلف را به هم متصل می‌کند. با جمع‌آوری کارت‌های واگن رنگی، می‌توانید مسیرهای ریلی بین شهرها را تصاحب کنید. هرچه مسیرهای طولانی‌تری بسازید و مقاصد بیشتری را کامل کنید، امتیاز بیشتری کسب می‌کنید. اما مراقب باشید – اگر نتوانید مقصد خود را کامل کنید، امتیاز منفی می‌گیرید! بلیط سفر با قوانین ساده در عرض ۵ دقیقه یاد گرفته می‌شود و برای ۲ تا ۵ بازیکن مناسب است.",
    price: 1500000,
    discountedPrice: 1100000,
    image: "/images/products/ticket.jpg",
    images: [
      "/images/products/ticket-1.jpg",
      "/images/products/ticket-2.jpg",
    ],
    players: "۲-۵",
    time: "۴۵-۶۰",
    age: "+۸",
    category: "family",
    tags: ["خانوادگی", "مسیرسازی", "قطار"],
    stockCount: 8,
    rating: 4.7,
    reviewsCount: 189,
    weight: 1400,
    dimensions: "۳۰ × ۳۰ × ۸ سانتی‌متر",
    publisher: "Days of Wonder",
    releaseYear: 2004,
  },
  {
    id: "pandemic",
    slug: "pandemic",
    title: "Pandemic",
    persianTitle: "پندمیک",
    description:
      "با همکاری تیم خود، جهان را از شر چهار بیماری مرگبار نجات دهید. استراتژی و همکاری کلید پیروزی است.",
    fullDescription:
      "پندمیک یک بازی همکاری منحصربه‌فرد است که در آن بازیکنان به‌عنوان اعضای یک تیم نخبه برای مهار شیوع چهار بیماری مرگبار در سراسر جهان مبارزه می‌کنند. هر بازیکن نقش خاصی دارد – دانشمند، پزشک، محقق یا متخصص عملیات – و باید از توانایی‌های ویژهٔ خود برای درمان بیماری‌ها و جلوگیری از گسترش آن‌ها استفاده کند. برخلاف بسیاری از بازی‌ها که در آن‌ها با یکدیگر رقابت می‌کنید، در پندمیک یا همه با هم پیروز می‌شوید یا همه شکست می‌خورید. این بازی با طراحی هوشمندانه و تنش دائمی، یکی از بهترین بازی‌های همکاری تاریخ است.",
    price: 1600000,
    discountedPrice: 1250000,
    image: "/images/products/pandemic.jpg",
    images: [
      "/images/products/pandemic-1.jpg",
      "/images/products/pandemic-2.jpg",
    ],
    players: "۲-۴",
    time: "۴۵",
    age: "+۸",
    category: "cooperative",
    tags: ["همکاری", "استراتژیک", "نجات جهان"],
    stockCount: 12,
    rating: 4.6,
    reviewsCount: 312,
    weight: 1100,
    dimensions: "۳۰ × ۲۲ × ۵ سانتی‌متر",
    publisher: "Z-Man Games",
    releaseYear: 2008,
  },
  {
    id: "brass-birmingham",
    slug: "brass-birmingham",
    title: "Brass Birmingham",
    persianTitle: "براس بیرمنگام",
    description:
      "در انقلاب صنعتی انگلیس، کارخانه‌ها بسازید، شبکه‌های حمل و نقل ایجاد کنید و به ثروت برسید.",
    fullDescription:
      "براس بیرمنگام یک بازی استراتژیک عمیق و اقتصادی است که در دوران انقلاب صنعتی انگلیس جریان دارد. بازیکنان در نقش کارآفرینان، کارخانه‌هایی برای تولید محصولات مختلف می‌سازند، شبکه‌های کانال و راه‌آهن ایجاد می‌کنند و محصولات خود را به بازارهای داخلی و خارجی می‌فروشند. این بازی با مکانیک‌های پیچیده اما منطقی، یکی از بهترین بازی‌های استراتژیک تاریخ محسوب می‌شود و در رتبه‌بندی BoardGameGeek همواره در صدر قرار دارد. براس بیرمنگام برای بازیکنان حرفه‌ای طراحی شده و هر دور آن ۹۰ تا ۱۸۰ دقیقه طول می‌کشد.",
    price: 2200000,
    discountedPrice: 1900000, // در فایل قبلی discountedPrice نداشت؛ در برخی نسخه‌ها هست، اینجا طبق داده‌های جدید اصلاح می‌کنم
    image: "/images/products/brass.webp",
    images: [
      "/images/products/brass1.webp",
      "/images/products/brass2.webp",
      "/images/products/brass3.webp",
      "/images/products/brass4.webp",
    ],
    players: "۲-۴",
    time: "۹۰-۱۸۰",
    age: "+۱۴",
    category: "strategy",
    tags: ["استراتژیک", "اقتصادی", "صنعتی"],
    stockCount: 2, // در فایل قبلی ۲ بود (ناموجود)
    rating: 4.9,
    reviewsCount: 178,
    weight: 1800,
    dimensions: "۳۲ × ۲۴ × ۸ سانتی‌متر",
    publisher: "Roxley Games",
    releaseYear: 2018,
  },
  {
    id: "azul",
    slug: "azul",
    title: "Azul",
    persianTitle: "آزول",
    description:
      "کاشی‌های زیبای پرتغالی را انتخاب و در الگوهای دیواری بچینید. بازی انتزاعی و چشمنواز.",
    fullDescription:
      "آزول یک بازی انتزاعی و چشمنواز است که از کاشی‌های تزئینی پرتغالی الهام گرفته شده است. در این بازی، بازیکنان کاشی‌های رنگی را از کارخانه‌های مرکزی جمع‌آوری کرده و روی تختهٔ شخصی خود می‌چینند. هدف، کامل کردن ردیف‌ها و ستون‌ها برای کسب امتیاز است. آزول با طراحی فوق‌العاده زیبا، قوانین ساده و گیم‌پلی اعتیادآور، برندهٔ جایزهٔ Spiel des Jahres ۲۰۱۸ شد و برای ۲ تا ۴ بازیکن مناسب است. هر دور بازی حدود ۳۰ تا ۴۵ دقیقه طول می‌کشد.",
    price: 1300000,
    discountedPrice: 950000,
    image: "/images/products/azul.jpg",
    images: [
      "/images/products/azul-1.jpg",
      "/images/products/azul-2.jpg",
    ],
    players: "۲-۴",
    time: "۳۰-۴۵",
    age: "+۸",
    category: "family",
    tags: ["انتزاعی", "خانوادگی", "زیبا"],
    stockCount: 6,
    rating: 4.5,
    reviewsCount: 201,
    weight: 900,
    dimensions: "۲۶ × ۲۶ × ۷ سانتی‌متر",
    publisher: "Plan B Games",
    releaseYear: 2017,
  },
  {
    id: "wingspan",
    slug: "wingspan",
    title: "Wingspan",
    persianTitle: "وینگ‌اسپن",
    description:
      "پرندگان مختلف را به پناهگاه خود جذب کنید، تخم بگذارید و امتیاز جمع کنید. بازی آرام و استراتژیک.",
    fullDescription:
      "وینگ‌اسپن یک بازی استراتژیک و آرامش‌بخش است که شما را به دنیای پرندگان می‌برد. در این بازی، هر بازیکن مدیر یک پناهگاه حیات وحش است و با جمع‌آوری غذا، تخم‌گذاری و جذب گونه‌های جدید پرندگان، امتیاز کسب می‌کند. کارت‌های پرندگان با طراحی خیره‌کننده و اطلاعات علمی واقعی، این بازی را به یک تجربهٔ آموزشی و سرگرم‌کننده تبدیل کرده‌اند. وینگ‌اسپن برندهٔ جوایز متعددی شده و برای ۱ تا ۵ بازیکن مناسب است.",
    price: 1900000,
    discountedPrice: 1450000,
    image: "/images/products/wingspan.jpg",
    images: [
      "/images/products/wingspan-1.jpg",
      "/images/products/wingspan-2.jpg",
      "/images/products/wingspan-3.jpg",
    ],
    players: "۱-۵",
    time: "۴۰-۷۰",
    age: "+۱۰",
    category: "strategy",
    tags: ["استراتژیک", "طبیعت", "پرندگان"],
    stockCount: 3,
    rating: 4.8,
    reviewsCount: 267,
    weight: 1500,
    dimensions: "۳۰ × ۲۲ × ۷ سانتی‌متر",
    publisher: "Stonemaier Games",
    releaseYear: 2019,
  },
  {
    id: "7-wonders",
    slug: "7-wonders",
    title: "7 Wonders",
    persianTitle: "عجایب هفتگانه",
    description:
      "رهبری یکی از تمدن‌های باستانی را بر عهده بگیرید و با ساخت عجایب، تاریخ را رقم بزنید.",
    fullDescription:
      "عجایب هفتگانه یک بازی کارتی و استراتژیک است که در آن هر بازیکن رهبری یکی از تمدن‌های بزرگ باستانی را بر عهده می‌گیرد. در طول سه عصر، بازیکنان با انتخاب کارت‌های مناسب، منابع جمع‌آوری می‌کنند، سازه‌های نظامی و علمی می‌سازند و عجایب خود را تکمیل می‌کنند. این بازی با مکانیک Drafting (انتخاب کارت و پاس دادن بقیه) طراحی شده و برای ۲ تا ۷ بازیکن مناسب است. بهترین ویژگی عجایب هفتگانه این است که حتی با ۷ بازیکن هم زمان بازی حدود ۳۰ دقیقه باقی می‌ماند.",
    price: 1400000,
    discountedPrice: 1050000,
    image: "/images/products/7wonders.jpg",
    images: [
      "/images/products/7wonders-1.jpg",
      "/images/products/7wonders-2.jpg",
    ],
    players: "۲-۷",
    time: "۳۰",
    age: "+۱۰",
    category: "card",
    tags: ["کارتی", "تمدن‌سازی", "خانوادگی"],
    stockCount: 10,
    rating: 4.6,
    reviewsCount: 345,
    weight: 800,
    dimensions: "۲۸ × ۲۰ × ۶ سانتی‌متر",
    publisher: "Repos Production",
    releaseYear: 2010,
  },
  {
    id: "terraforming-mars",
    slug: "terraforming-mars",
    title: "Terraforming Mars",
    persianTitle: "مریخ‌سازی",
    description:
      "بشریت به مریخ مهاجرت کرده! با پروژه‌های بزرگ، سیاره سرخ را قابل سکونت کنید.",
    fullDescription:
      "مریخ‌سازی یک بازی استراتژیک علمی‌تخیلی است که در آن بازیکنان در نقش شرکت‌های بزرگ، برای تبدیل مریخ به سیاره‌ای قابل سکونت رقابت می‌کنند. با افزایش دما، تولید اکسیژن و ایجاد اقیانوس‌ها، سیاره را terraform می‌کنید و امتیاز کسب می‌کنید. این بازی با بیش از ۲۰۰ کارت پروژه، گیم‌پلی بسیار متنوع و عمیقی دارد و هر بار تجربه‌ای متفاوت ارائه می‌دهد. مریخ‌سازی برای ۱ تا ۵ بازیکن مناسب است و هر دور آن حدود ۱۲۰ دقیقه طول می‌کشد.",
    price: 2000000,
    discountedPrice: 1800000, // در فایل قبلی discountedPrice نداشت، اینجا یک تخفیف فرضی می‌گذارم
    image: "/images/products/terraforming.jpg",
    images: [
      "/images/products/terraforming-1.jpg",
      "/images/products/terraforming-2.jpg",
      "/images/products/terraforming-3.jpg",
    ],
    players: "۱-۵",
    time: "۱۲۰",
    age: "+۱۲",
    category: "strategy",
    tags: ["استراتژیک", "علمی‌تخیلی", "فضا"],
    stockCount: 4,
    rating: 4.7,
    reviewsCount: 423,
    weight: 1700,
    dimensions: "۳۰ × ۳۰ × ۸ سانتی‌متر",
    publisher: "FryxGames",
    releaseYear: 2016,
  },
  {
    id: "splendor",
    slug: "splendor",
    title: "Splendor",
    persianTitle: "اسپلندور",
    description:
      "تاجر جواهر شوید! با جمع‌آوری سنگ‌های قیمتی، کارت‌های توسعه بخرید و امپراتوری خود را بسازید.",
    fullDescription:
      "اسپلندور یک بازی کارتی و اقتصادی ساده اما عمیق است که در آن بازیکنان در نقش تاجران جواهر، سنگ‌های قیمتی جمع‌آوری می‌کنند و با آن‌ها کارت‌های توسعه می‌خرند. هر کارت جدید، امتیاز می‌دهد و به عنوان یک معدن دائمی عمل می‌کند که خریدهای بعدی را آسان‌تر می‌کند. هدف، رسیدن به ۱۵ امتیاز قبل از سایر بازیکنان است. اسپلندور با قوانینی که در ۵ دقیقه یاد می‌گیرید، گیم‌پلی سریع و اعتیادآور، برای ۲ تا ۴ بازیکن ایده‌آل است.",
    price: 1200000,
    discountedPrice: 890000,
    image: "/images/products/splendor.jpg",
    images: [
      "/images/products/splendor-1.jpg",
      "/images/products/splendor-2.jpg",
    ],
    players: "۲-۴",
    time: "۳۰",
    age: "+۱۰",
    category: "card",
    tags: ["کارتی", "اقتصادی", "خانوادگی"],
    stockCount: 7,
    rating: 4.4,
    reviewsCount: 156,
    weight: 700,
    dimensions: "۲۲ × ۱۸ × ۵ سانتی‌متر",
    publisher: "Space Cowboys",
    releaseYear: 2014,
  },
  {
    id: "carcassonne",
    slug: "carcassonne",
    title: "Carcassonne",
    persianTitle: "کارکاسون",
    description:
      "شهرها، جاده‌ها و صومعه‌های قرون وسطایی را کاشی‌به‌کاشی بسازید و با مهره‌های خود امتیاز بگیرید.",
    fullDescription:
      "کارکاسون یک بازی کاشی‌چینی کلاسیک است که در آن بازیکنان با قرار دادن کاشی‌های مربعی، شهرها، جاده‌ها، صومعه‌ها و مزارع را می‌سازند. هر بازیکن مهره‌هایی دارد که می‌تواند روی این عوارض قرار دهد تا با کامل شدن آن‌ها امتیاز کسب کند. این بازی با قوانین بسیار ساده، گیم‌پلی آرام و استراتژیک، برای ۲ تا ۵ بازیکن و حتی کودکان ۷ سال به بالا مناسب است. کارکاسون برندهٔ جایزهٔ Spiel des Jahres ۲۰۰۱ شد.",
    price: 1100000,
    discountedPrice: 850000,
    image: "/images/products/carcassonne.jpg",
    images: [
      "/images/products/carcassonne-1.jpg",
      "/images/products/carcassonne-2.jpg",
    ],
    players: "۲-۵",
    time: "۳۵",
    age: "+۷",
    category: "family",
    tags: ["خانوادگی", "کاشی‌چینی", "قرون وسطی"],
    stockCount: 9,
    rating: 4.3,
    reviewsCount: 198,
    weight: 750,
    dimensions: "۲۵ × ۱۹ × ۷ سانتی‌متر",
    publisher: "Hans im Glück",
    releaseYear: 2000,
  },
  {
    id: "7-wonders-duel",
    slug: "7-wonders-duel",
    title: "7 Wonders Duel",
    persianTitle: "عجایب هفتگانه دوئل",
    description:
      "نسخه دو نفره و استراتژیک عجایب هفتگانه. تمدنی قدرتمند بسازید و دشمن را شکست دهید.",
    fullDescription:
      "عجایب هفتگانه دوئل نسخهٔ دو نفرهٔ بازی محبوب عجایب هفتگانه است که به‌طور خاص برای دو بازیکن طراحی شده است. در این بازی، شما و حریف‌تان هر کدام رهبری یک تمدن باستانی را بر عهده دارید و با انتخاب کارت‌ها از یک ساختار هرمی، منابع جمع‌آوری می‌کنید، ارتش می‌سازید و عجایب خود را تکمیل می‌کنید. این بازی سه راه پیروزی دارد: نظامی، علمی یا امتیازی. با مکانیک‌های عمیق و زمان بازی حدود ۳۰ دقیقه، عجایب هفتگانه دوئل یکی از بهترین بازی‌های دونفرهٔ تاریخ است.",
    price: 1300000,
    discountedPrice: 1100000,
    image: "/images/products/7wonders-duel.jpg",
    images: [
      "/images/products/7wonders-duel-1.jpg",
      "/images/products/7wonders-duel-2.jpg",
    ],
    players: "۲",
    time: "۳۰",
    age: "+۱۰",
    category: "two-player",
    tags: ["دونفره", "استراتژیک", "کارتی"],
    stockCount: 2,
    rating: 4.7,
    reviewsCount: 167,
    weight: 650,
    dimensions: "۲۲ × ۱۸ × ۵ سانتی‌متر",
    publisher: "Repos Production",
    releaseYear: 2015,
  },
  {
    id: "patchwork",
    slug: "patchwork",
    title: "Patchwork",
    persianTitle: "پچ‌ورک",
    description:
      "تکه‌های پارچه را بدوزید و لحاف زیبای خود را بسازید. بازی دونفره آرام و دلنشین.",
    fullDescription:
      "پچ‌ورک یک بازی دونفرهٔ آرام و دلنشین است که در آن بازیکنان با انتخاب تکه‌های پارچه با شکل‌های مختلف، لحاف خود را می‌سازند. هر تکه پارچه هزینه‌ای (دکمه) دارد که باید پرداخت کنید و زمانی می‌برد که شما را روی تختهٔ زمان جلو می‌برد. هدف، پر کردن صفحهٔ شخصی با کمترین فضای خالی و جمع‌آوری بیشترین دکمه است. این بازی با طراحی زیبا، قوانین ساده و گیم‌پلی رضایت‌بخش، برای ۲ بازیکن و بالای ۸ سال عالی است.",
    price: 900000,
    image: "/images/products/patchwork.jpg",
    images: [
      "/images/products/patchwork-1.jpg",
      "/images/products/patchwork-2.jpg",
    ],
    players: "۲",
    time: "۱۵-۳۰",
    age: "+۸",
    category: "two-player",
    tags: ["دونفره", "انتزاعی", "آرام"],
    stockCount: 5,
    rating: 4.5,
    reviewsCount: 134,
    weight: 500,
    dimensions: "۲۰ × ۲۰ × ۵ سانتی‌متر",
    publisher: "Lookout Games",
    releaseYear: 2014,
  },
  {
    id: "codenames",
    slug: "codenames",
    title: "Codenames",
    persianTitle: "اسامی مخفی",
    description:
      "دو تیم، یک شبکه کلمات، و یک استاد جاسوس. با حدس زدن کلمات مخفی تیم خود، پیروز شوید!",
    fullDescription:
      "اسامی مخفی یک بازی مهمانی و تیمی فوق‌العاده محبوب است که در آن دو تیم با یکدیگر رقابت می‌کنند. در هر تیم، یک نفر نقش «استاد جاسوس» را دارد که باید با دادن یک کلمهٔ راهنما و یک عدد، هم‌تیمی‌های خود را به سمت کلمات مخفی‌شان هدایت کند. اما مراقب باشید – یک حدس اشتباه می‌تواند شما را به کلمات تیم حریف، شهروندان بی‌گناه یا حتی قاتل برساند! این بازی برای ۲ تا ۸ بازیکن (یا حتی بیشتر) مناسب است و هر دور آن فقط ۱۵ دقیقه طول می‌کشد.",
    price: 950000,
    discountedPrice: 800000,
    image: "/images/products/codenames.jpg",
    images: [
      "/images/products/codenames-1.jpg",
      "/images/products/codenames-2.jpg",
    ],
    players: "۲-۸",
    time: "۱۵",
    age: "+۱۴",
    category: "party",
    tags: ["مهمانی", "کلمات", "تیمی"],
    stockCount: 15,
    rating: 4.6,
    reviewsCount: 278,
    weight: 400,
    dimensions: "۲۳ × ۱۶ × ۶ سانتی‌متر",
    publisher: "Czech Games Edition",
    releaseYear: 2015,
  },
  {
    id: "dixit",
    slug: "dixit",
    title: "Dixit",
    persianTitle: "دیکسیت",
    description:
      "با کارت‌های رویایی و خیال‌انگیز داستان بگویید و ذهن دیگران را بخوانید. بازی مهمانی خلاقانه.",
    fullDescription:
      "دیکسیت یک بازی مهمانی خلاقانه و رویایی است که با کارت‌های بزرگ و نقاشی‌های خیال‌انگیز خود شناخته می‌شود. در هر دور، یک بازیکن (داستان‌گو) یکی از کارت‌های خود را انتخاب می‌کند و یک عبارت یا جمله دربارهٔ آن می‌گوید. سایر بازیکنان نیز کارتی از دست خود انتخاب می‌کنند که به آن عبارت مربوط باشد. سپس همهٔ کارت‌ها رو می‌شوند و بازیکنان باید حدس بزنند کارت اصلی داستان‌گو کدام است. دیکسیت برای ۳ تا ۶ بازیکن مناسب است و برندهٔ جایزهٔ Spiel des Jahres ۲۰۱۰ شد.",
    price: 1100000,
    image: "/images/products/dixit.jpg",
    images: [
      "/images/products/dixit-1.jpg",
      "/images/products/dixit-2.jpg",
      "/images/products/dixit-3.jpg",
    ],
    players: "۳-۶",
    time: "۳۰",
    age: "+۸",
    category: "party",
    tags: ["مهمانی", "خلاقانه", "داستان‌گویی"],
    stockCount: 11,
    rating: 4.4,
    reviewsCount: 245,
    weight: 600,
    dimensions: "۲۸ × ۲۸ × ۶ سانتی‌متر",
    publisher: "Libellud",
    releaseYear: 2008,
  },
  {
    id: "root",
    slug: "root",
    title: "Root",
    persianTitle: "ریشه",
    description:
      "هر بازیکن یکی از جناح‌های جنگل را کنترل می‌کند. جنگی نامتقارن و استراتژیک در دل طبیعت.",
    fullDescription:
      "ریشه یک بازی استراتژیک نامتقارن است که در آن هر بازیکن کنترل یکی از جناح‌های جنگل را به عهده می‌گیرد – هر کدام با قوانین، اهداف و سبک بازی کاملاً متفاوت. مارکیز دو کت می‌خواهد جنگل را صنعتی کند، خاندان ایری می‌خواهد قلمرو خود را بازپس گیرد، اتحادیهٔ جنگل‌نشینان به دنبال شورش است و ولگرد تنها در سایه‌ها حرکت می‌کند. این بازی با طراحی هنری زیبا و گیم‌پلی عمیق، یکی از بهترین بازی‌های استراتژیک سال‌های اخیر است.",
    price: 2100000,
    image: "/images/products/root.jpg",
    images: [
      "/images/products/root-1.jpg",
      "/images/products/root-2.jpg",
    ],
    players: "۲-۴",
    time: "۶۰-۹۰",
    age: "+۱۴",
    category: "strategy",
    tags: ["استراتژیک", "جنگ", "نامتقارن"],
    stockCount: 0, // ناموجود
    rating: 4.8,
    reviewsCount: 198,
    weight: 1600,
    dimensions: "۲۸ × ۲۲ × ۸ سانتی‌متر",
    publisher: "Leder Games",
    releaseYear: 2018,
  },
  {
    id: "scythe",
    slug: "scythe",
    title: "Scythe",
    persianTitle: "سایث",
    description:
      "در اروپای شرقی جایگزین، ماشین‌های جنگی بسازید و منابع را مدیریت کنید تا امپراتوری خود را گسترش دهید.",
    fullDescription:
      "سایث یک بازی استراتژیک حماسی است که در اروپای شرقی دههٔ ۱۹۲۰ و در دنیایی جایگزین جریان دارد. بازیکنان رهبری یکی از پنج جناح را بر عهده دارند و با مدیریت منابع، ساخت ماشین‌های جنگی بزرگ (مک)، گسترش قلمرو و تعامل با سایر بازیکنان، برای تبدیل شدن به قدرت برتر رقابت می‌کنند. سایث با طراحی هنری خیره‌کننده، مینیاتورهای باکیفیت و گیم‌پلی عمیق اما در دسترس، یکی از محبوب‌ترین بازی‌های استراتژیک مدرن است.",
    price: 2300000,
    discountedPrice: 1900000,
    image: "/images/products/scythe.jpg",
    images: [
      "/images/products/scythe-1.jpg",
      "/images/products/scythe-2.jpg",
      "/images/products/scythe-3.jpg",
    ],
    players: "۱-۵",
    time: "۹۰-۱۲۰",
    age: "+۱۴",
    category: "strategy",
    tags: ["استراتژیک", "اقتصادی", "ماشین‌های جنگی"],
    stockCount: 3,
    rating: 4.9,
    reviewsCount: 312,
    weight: 2100,
    dimensions: "۳۶ × ۲۸ × ۸ سانتی‌متر",
    publisher: "Stonemaier Games",
    releaseYear: 2016,
  },
];

// ----- helpers -----
const parsePlayerRange = (players: string): { min: number; max: number } => {
  const parts = players.split("-");
  const min = parseInt(parts[0]);
  const max = parseInt(parts[1] || parts[0]);
  return { min, max };
};

// ----- main functions -----
export function getProduct(id: string): Product | undefined {
  return productList.find((p) => p.id === id);
}

export function getRelatedProducts(id: string, count: number = 4): Product[] {
  const product = getProduct(id);
  if (!product) return [];
  return productList
    .filter((p) => p.id !== id && p.category === product.category)
    .slice(0, count);
}

export async function getProducts({
  page = 1,
  sort = "newest",
  category = "",
  playerCount = "",
  minPrice = 0,
  maxPrice = 10000000,
  limit = 12,
}: {
  page?: number;
  sort?: string;
  category?: string;
  playerCount?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}): Promise<{
  products: Product[];
  totalPages: number;
  totalProducts: number;
}> {
  let filtered = [...productList];

  if (category) {
    const categories = category.split(",");
    filtered = filtered.filter((p) => categories.includes(p.category));
  }

  if (playerCount) {
    const playerCounts = playerCount.split(",");
    filtered = filtered.filter((p) => {
      const range = parsePlayerRange(p.players);
      return playerCounts.some((count) => {
        const desired = parseInt(count);
        return desired >= range.min && desired <= range.max;
      });
    });
  }

  filtered = filtered.filter((p) => {
    const effectivePrice = p.discountedPrice ?? p.price;
    return effectivePrice >= minPrice && effectivePrice <= maxPrice;
  });

  switch (sort) {
    case "price-asc":
      filtered.sort((a, b) => (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price));
      break;
    case "price-desc":
      filtered.sort((a, b) => (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price));
      break;
    case "rating":
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      filtered.sort((a, b) => b.releaseYear - a.releaseYear);
      break;
    case "oldest":
      filtered.sort((a, b) => a.releaseYear - b.releaseYear);
      break;
    default:
      filtered.sort((a, b) => b.releaseYear - a.releaseYear);
  }

  const totalProducts = filtered.length;
  const totalPages = Math.ceil(totalProducts / limit);
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return {
    products: paginated,
    totalPages,
    totalProducts,
  };
}

export async function getProductsByType(
  type: "discount" | "bestseller" | "new"
): Promise<Product[]> {
  let filtered = [...productList];

  switch (type) {
    case "discount":
      filtered = filtered.filter((p) => p.discountedPrice && p.discountedPrice > 0);
      filtered.sort((a, b) => {
        const aPercent = (a.price - (a.discountedPrice ?? a.price)) / a.price;
        const bPercent = (b.price - (b.discountedPrice ?? b.price)) / b.price;
        return bPercent - aPercent;
      });
      break;
    case "bestseller":
      filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
      break;
    case "new":
      filtered.sort((a, b) => b.releaseYear - a.releaseYear);
      break;
  }
  return filtered.slice(0, 8);
}

// ========== تابع جستجوی جدید ==========
/**
 * جستجوی محصولات بر اساس یک عبارت.
 * در عنوان فارسی/انگلیسی، توضیحات و تگ‌ها جستجو می‌کند.
 * @param query - عبارت جستجو (می‌تواند خالی باشد)
 * @returns آرایه‌ای از محصولات مرتبط
 */
export function searchProducts(query: string): Product[] {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();

  return productList.filter((product) => {
    return (
      product.title.toLowerCase().includes(q) ||
      product.persianTitle.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });
}