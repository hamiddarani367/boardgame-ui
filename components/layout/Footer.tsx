import Link from "next/link";

const footerColumns = [
  {
    title: "خدمات مشتریان",
    items: [
      { title: "پاسخ به سوالات متداول", href: "#" },
      { title: "رویه ارسال سفارش", href: "#" },
      { title: "شرایط بازگشت کالا", href: "#" },
      { title: "حریم خصوصی", href: "#" },
    ],
  },
  {
    title: "فروشگاه",
    items: [
      { title: "محصولات", href: "/products" },
      { title: "دسته‌بندی‌ها", href: "/categories" },
      { title: "بردگیم‌های جدید", href: "#" },
      { title: "تخفیف‌ها", href: "#" },
    ],
  },
  {
    title: "راهنمای خرید",
    items: [
      { title: "نحوه ثبت سفارش", href: "#" },
      { title: "شیوه پرداخت", href: "#" },
      { title: "پیگیری سفارش", href: "#" },
      { title: "ضمانت اصالت کالا", href: "#" },
    ],
  },
  {
    title: "ارتباط با ما",
    items: [
      { title: "درباره ما", href: "#" },
      { title: "تماس با ما", href: "#" },
      { title: "همکاری با ما", href: "#" },
      { title: "وبلاگ", href: "#" },
    ],
  },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://telegram.org",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.938z"/>
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ),
  },
  {
    name: "Bale",
    href: "https://bale.ai",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <circle cx="12" cy="12" r="12" fill="#00A885"/>
        <text x="12" y="17" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">B</text>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white w-full">
      <div className="w-full px-6 md:px-10 lg:px-16 py-14">
        <div className="mx-auto max-w-[130rem]">
          <div className="flex flex-col gap-4 border-b border-gray-200 pb-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-blue-600">
                🎲 Board Kingdom
              </h2>
              <p className="mt-4 max-w-xl leading-8 text-gray-500">
                فروشگاه تخصصی بردگیم، بازی‌های رومیزی، اکسپنشن و
                لوازم جانبی با ارسال سریع به سراسر ایران.
              </p>
            </div>

            <div className="text-sm leading-8 text-gray-600">
              <p>☎️ 021-12345678</p>
              <p>📧 info@boardkingdom.ir</p>
              <p>🕒 همه روزه ۹ تا ۲۱</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 py-12">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-5 font-bold text-gray-900">{column.title}</h3>
                <ul className="space-y-3">
                  {column.items.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-500 transition hover:text-blue-600"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="col-span-2 sm:col-span-1">
              <h3 className="mb-5 font-bold text-gray-900">با ما همراه باشید</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-blue-100 hover:text-blue-600"
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 border-t border-gray-200 pt-8 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-500">
              © 2026 Board Kingdom - تمامی حقوق محفوظ است.
            </p>

            <div className="flex gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200">
                🛡️
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200">
                ⭐
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200">
                ✅
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}