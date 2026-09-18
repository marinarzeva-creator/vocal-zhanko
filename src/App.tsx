import React, { useState } from 'react';
import {
  Mic,
  Music,
  Heart,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Instagram,
  Check,
  Send,
  Phone,
  User,
  ArrowRight,
  Menu,
  X,
  Volume2,
  Award,
  Smile,
  ChevronDown
} from 'lucide-react';

interface BookingFormData {
  name: string;
  phone: string;
  service: string;
  duration: string;
  comment?: string;
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    phone: '',
    service: 'Вокал',
    duration: '55 хв',
    comment: ''
  });
  const [phoneInput, setPhoneInput] = useState('');
  const [rawPhoneDigits, setRawPhoneDigits] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handlePhoneChange = (input: string) => {
    // Extract only digits
    let digits = input.replace(/\D/g, '');

    // If user pasted with 380...
    if (digits.startsWith('380')) {
      digits = digits.slice(3);
    }

    // In Ukraine, numbers start with mobile code (e.g. 50, 67, 93, 73, etc.).
    // If user types a leading 0 (e.g. 050, 067), strip it because +380 already covers it.
    if (digits.startsWith('0')) {
      digits = digits.replace(/^0+/, '');
    }

    // Limit to exactly 9 digits
    digits = digits.slice(0, 9);
    setRawPhoneDigits(digits);

    // Format for friendly Ukrainian display: (XX) XXX-XX-XX
    let formatted = '';
    if (digits.length > 0) {
      if (digits.length <= 2) {
        formatted = `(${digits}`;
      } else if (digits.length <= 5) {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      } else if (digits.length <= 7) {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5)}`;
      } else {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7, 9)}`;
      }
    }
    setPhoneInput(formatted);
    if (submitError) setSubmitError(null);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectPricing = (duration: string, serviceName = 'Вокал') => {
    setFormData((prev) => ({
      ...prev,
      duration,
      service: serviceName
    }));
    scrollToSection('contacts');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setSubmitError("Будь ласка, введіть ваше ім'я");
      return;
    }

    if (rawPhoneDigits.length < 9) {
      setSubmitError("Будь ласка, введіть повний номер телефону (9 цифр після +380)");
      return;
    }

    const formattedFullPhone = `+380 ${phoneInput}`;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
     const response = await fetch('https://vocal-zhanko.vercel.app/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: formattedFullPhone,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormData((prev) => ({ ...prev, phone: formattedFullPhone }));
        setIsSubmitted(true);
      } else {
        setSubmitError(data.error || 'Не вдалося надіслати заявку. Будь ласка, спробуйте ще раз або напишіть в Instagram.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      // Fallback gracefully so user can still continue
      setFormData((prev) => ({ ...prev, phone: formattedFullPhone }));
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'Чи потрібен музичний досвід або знання нот для старту?',
      a: 'Ні, абсолютна більшість учнів починає з нуля! Ми вибудовуємо навчання послідовно, без стресу та складних термінів, з фокусом на природність та радість від музикування.'
    },
    {
      q: 'Що відбувається на пробному занятті?',
      a: 'Знайомимося, визначаємо ваш природний тембр, діапазон та музичні цілі. Робимо легкі дихальні вправи, пробуємо перші розспівки або базові акорди на фортепіано і складаємо комфортний план розвитку.'
    },
    {
      q: 'Де саме у Києві розташований простір?',
      a: 'Простір знаходиться за адресою: м. Київ, вул. Максима Кривоноса, 27. Це затишна студія зі зручною транспортною розв\'язкою та комфортним середовищем для творчості.'
    },
    {
      q: 'Чи можна поєднувати уроки вокалу та фортепіано?',
      a: 'Так! Багато учнів обирають комплексний формат або чергують заняття, навчаючись акомпанувати собі під час співу.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8FD] text-[#2D223B] font-sans antialiased selection:bg-[#E8DEF8] selection:text-[#3B2556]">
      {/* 1. Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#FAF8FD]/90 backdrop-blur-md border-b border-[#EADDFF]/50 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo / Brand */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('hero');
            }}
            className="flex items-center gap-3 group"
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8E6CAE] to-[#D4949B] flex items-center justify-center text-white shadow-sm shadow-[#8E6CAE]/20 group-hover:scale-105 transition-transform duration-300">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-[#37264C] block leading-tight">
                Катерина Жанько
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#846E97] font-medium block">
                Творчий простір • Київ
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#55456A]">
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-[#8E6CAE] transition-colors cursor-pointer"
              id="nav-about"
            >
              Про простір
            </button>
            <button
              onClick={() => scrollToSection('courses')}
              className="hover:text-[#8E6CAE] transition-colors cursor-pointer"
              id="nav-courses"
            >
              Напрямки
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hover:text-[#8E6CAE] transition-colors cursor-pointer"
              id="nav-pricing"
            >
              Ціни
            </button>
            <button
              onClick={() => scrollToSection('contacts')}
              className="hover:text-[#8E6CAE] transition-colors cursor-pointer"
              id="nav-contacts"
            >
              Контакти
            </button>
          </nav>

          {/* Desktop Call to action */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://www.instagram.com/vocalcoach_zhanko/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram профіль"
              className="p-2.5 rounded-full text-[#6E5983] hover:text-[#9F5D6B] hover:bg-[#F3E8FA] transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <button
              onClick={() => scrollToSection('contacts')}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#7F57A4] via-[#8F6BAF] to-[#B97282] hover:opacity-95 text-white text-sm font-medium tracking-wide shadow-md shadow-[#7F57A4]/25 hover:shadow-lg hover:shadow-[#7F57A4]/35 active:scale-98 transition-all cursor-pointer"
              id="nav-cta-btn"
            >
              Записатися
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#55456A] hover:bg-[#F3E8FA] transition-colors"
            aria-label="Перемикач меню"
            id="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#EADDFF] bg-[#FAF8FD] px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-2 px-3 rounded-lg text-[#47355B] hover:bg-[#F3E8FA] font-medium"
            >
              Про простір
            </button>
            <button
              onClick={() => scrollToSection('courses')}
              className="block w-full text-left py-2 px-3 rounded-lg text-[#47355B] hover:bg-[#F3E8FA] font-medium"
            >
              Напрямки
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="block w-full text-left py-2 px-3 rounded-lg text-[#47355B] hover:bg-[#F3E8FA] font-medium"
            >
              Ціни
            </button>
            <button
              onClick={() => scrollToSection('contacts')}
              className="block w-full text-left py-2 px-3 rounded-lg text-[#47355B] hover:bg-[#F3E8FA] font-medium"
            >
              Контакти
            </button>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => scrollToSection('contacts')}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#7F57A4] to-[#B97282] text-white text-center font-medium shadow-sm"
              >
                Записатися
              </button>
              <a
                href="https://www.instagram.com/vocalcoach_zhanko/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-full border border-[#D5BEF0] text-[#55456A] font-medium"
              >
                <Instagram className="w-4 h-4 text-[#B97282]" />
                @vocalcoach_zhanko
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section
        id="hero"
        className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32 bg-gradient-to-b from-[#FAF8FD] via-[#F4ECFB]/60 to-[#FAF8FD]"
      >
        {/* Soft atmospheric ambient glow orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[550px] sm:w-[750px] h-[350px] bg-gradient-to-tr from-[#E6D4FC]/40 via-[#FCE4EC]/50 to-[#E8DEF8]/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#FAD2D8]/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFFFF]/90 border border-[#E7D6FA] shadow-xs text-xs sm:text-sm font-medium text-[#734F94] mb-8 animate-gentle-float">
            <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
            <span>Затишна студія вокалу та фортепіано у Києві</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#2B1B3E] max-w-4xl mx-auto leading-[1.1] mb-6">
            Творчий простір <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#6F4796] via-[#8F6BAF] to-[#B76E79] bg-clip-text text-transparent italic font-normal">
              Катерини Жанько
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#5F4E75] max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Відкрийте свій голос та пориньте у світ музики через вокал та фортепіано
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => scrollToSection('contacts')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#7B539F] via-[#8C64AC] to-[#BD7382] hover:opacity-95 text-white font-medium text-base shadow-lg shadow-[#7B539F]/25 hover:shadow-xl hover:shadow-[#7B539F]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-2 group"
              id="hero-trial-btn"
            >
              <span>Записатися на пробне заняття</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <a
              href="https://www.instagram.com/vocalcoach_zhanko/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/90 hover:bg-white border border-[#E2D2F2] hover:border-[#CFAFE8] text-[#55436C] font-medium text-base shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2.5 group"
              id="hero-instagram-btn"
            >
              <Instagram className="w-4 h-4 text-[#BD7382] group-hover:scale-110 transition-transform" />
              <span>Наш Instagram</span>
            </a>
          </div>

          {/* Key micro-benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto pt-8 border-t border-[#E8DEF8]/60 text-left">
            <div className="p-3 rounded-2xl bg-white/50 border border-[#F0E5FC]/60">
              <div className="text-xs uppercase tracking-wider text-[#8A769D] font-semibold mb-1">Формат</div>
              <div className="text-sm font-medium text-[#39284F]">Індивідуальні заняття</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/50 border border-[#F0E5FC]/60">
              <div className="text-xs uppercase tracking-wider text-[#8A769D] font-semibold mb-1">Рівень</div>
              <div className="text-sm font-medium text-[#39284F]">З нуля до сцени</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/50 border border-[#F0E5FC]/60">
              <div className="text-xs uppercase tracking-wider text-[#8A769D] font-semibold mb-1">Атмосфера</div>
              <div className="text-sm font-medium text-[#39284F]">Безпечно & затишно</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/50 border border-[#F0E5FC]/60">
              <div className="text-xs uppercase tracking-wider text-[#8A769D] font-semibold mb-1">Локація</div>
              <div className="text-sm font-medium text-[#39284F]">вул. М. Кривоноса, 27</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About Section ("Про простір") */}
      <section id="about" className="py-20 sm:py-28 bg-[#FFFFFF] border-y border-[#F3EAF8] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left aesthetic decorative visual element */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#F7F2FC] to-[#FDF4F5] border border-[#EEDEFA] shadow-lg shadow-[#8E6CAE]/5 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E8DEF8]/50 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#FCD8DE]/40 rounded-full blur-2xl pointer-events-none" />

                <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-[#EADDFF] flex items-center justify-center text-[#865DAE] mb-6">
                  <Music className="w-8 h-8" />
                </div>

                <div className="space-y-4 relative z-10">
                  <h3 className="font-serif-display text-2xl font-bold text-[#35254A]">
                    Творчість, довіра та гармонія
                  </h3>
                  <p className="text-sm leading-relaxed text-[#625176]">
                    Кожен голос — унікальний інструмент душі. Тут ви знайдете підтримку, дбайливе ставлення та професійний простір для вашого звучання.
                  </p>

                  <div className="pt-4 border-t border-[#EADEF8] grid grid-cols-2 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-white/70">
                      <div className="font-serif-display text-xl font-bold text-[#7E55A1]">100%</div>
                      <div className="text-[11px] text-[#6E5D83]">Індивідуальний темп</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/70">
                      <div className="font-serif-display text-xl font-bold text-[#B76E79]">Турбота</div>
                      <div className="text-[11px] text-[#6E5D83]">Без затисків та стресу</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right text content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block px-3.5 py-1 rounded-full bg-[#F3E8FA] text-xs font-semibold uppercase tracking-wider text-[#794E9A]">
                Про простір
              </div>

              <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#291A3C] leading-tight">
                Місце, де народжується щире звучання
              </h2>

              <p className="text-base sm:text-lg text-[#55456A] leading-relaxed">
                «Творчий простір Катерини Жанько» — це затишне місце у Києві, де ви зможете опанувати мистецтво співу та гри на фортепіано. Наш підхід поєднує сучасні методики постановки голосу, розкриття творчого потенціалу та дбайливе ставлення до кожної особистості. Музика — це шлях до самовираження та гармонії.
              </p>

              <div className="pt-2 space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#F3E8FA] text-[#794E9A] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#322346]">Сучасні методики вокалу</h4>
                    <p className="text-xs sm:text-sm text-[#6C5B82]">
                      Фізіологічно безпечна техніка, розвиток міксту, вібрато та робота з резонансом.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#FCECEE] text-[#B76E79] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#322346]">Гра у задоволення</h4>
                    <p className="text-xs sm:text-sm text-[#6C5B82]">
                      Вивчаємо улюблені пісні та сучасні фортепіанні мелодії вже з перших занять.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#F3E8FA] text-[#794E9A] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#322346]">Психологічний комфорт</h4>
                    <p className="text-xs sm:text-sm text-[#6C5B82]">
                      Вільний простір без критики, де легко позбутися сорому й відчути впевненість.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Courses / Directions ("Напрямки") */}
      <section id="courses" className="py-20 sm:py-28 bg-[#FAF8FD] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block px-3.5 py-1 rounded-full bg-[#F3E8FA] text-xs font-semibold uppercase tracking-wider text-[#794E9A] mb-3">
              Напрямки
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#291A3C] mb-4">
              Оберіть свій музичний вектор
            </h2>
            <p className="text-base sm:text-lg text-[#615077] font-light">
              Індивідуальні програми, адаптовані під ваші цілі — від перших нот до впевненого виступу.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Direction 1: Індивідуальний вокал */}
            <div
              id="course-vocal"
              className="bg-white rounded-3xl p-8 border border-[#EDE1F7] shadow-sm hover:shadow-xl hover:shadow-[#8E6CAE]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F1E5FC] to-[#FCEEF1] text-[#865DAE] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Mic className="w-7 h-7" />
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-[#301F44] mb-3">
                  Індивідуальний вокал
                </h3>
                <p className="text-sm text-[#635277] mb-6 leading-relaxed">
                  Повне занурення у розкриття природного звуку, подолання затисків та робота над індивідуальною манерою співу.
                </p>

                <div className="space-y-3 pt-4 border-t border-[#F4ECFB]">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#463659]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8E6CAE]" />
                    <span>Постановка дихання та опори</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#463659]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8E6CAE]" />
                    <span>Розширення вокального діапазону</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#463659]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8E6CAE]" />
                    <span>Робота з улюбленим репертуаром</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#F4ECFB]">
                <button
                  onClick={() => handleSelectPricing('55 хв', 'Вокал')}
                  className="w-full py-3 rounded-full bg-[#FAF6FD] hover:bg-[#8E6CAE] text-[#6E4B91] hover:text-white font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Обрати цей напрямок</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Direction 2: Уроки фортепіано */}
            <div
              id="course-piano"
              className="bg-white rounded-3xl p-8 border border-[#EDE1F7] shadow-sm hover:shadow-xl hover:shadow-[#8E6CAE]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F1E5FC] to-[#FCEEF1] text-[#B76E79] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Music className="w-7 h-7" />
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-[#301F44] mb-3">
                  Уроки фортепіано
                </h3>
                <p className="text-sm text-[#635277] mb-6 leading-relaxed">
                  Чарівний світ клавіш без нудної рутини. Навчаємося грати усвідомлено, пластично та з глибоким задоволенням.
                </p>

                <div className="space-y-3 pt-4 border-t border-[#F4ECFB]">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#463659]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B76E79]" />
                    <span>Навчання з нуля для дорослих та дітей</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#463659]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B76E79]" />
                    <span>Акомпанемент та підбір на слух</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#463659]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B76E79]" />
                    <span>Нотна грамота та улюблені мелодії</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#F4ECFB]">
                <button
                  onClick={() => handleSelectPricing('55 хв', 'Фортепіано')}
                  className="w-full py-3 rounded-full bg-[#FAF6FD] hover:bg-[#B76E79] text-[#864A54] hover:text-white font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Обрати цей напрямок</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Direction 3: Вокал як терапія */}
            <div
              id="course-therapy"
              className="bg-white rounded-3xl p-8 border border-[#EDE1F7] shadow-sm hover:shadow-xl hover:shadow-[#8E6CAE]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#F9E2E5]/50 to-transparent rounded-bl-3xl pointer-events-none" />

              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FCEEF1] to-[#F1E5FC] text-[#B76E79] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Heart className="w-7 h-7" />
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-[#301F44] mb-3">
                  Вокал як терапія
                </h3>
                <p className="text-sm text-[#635277] mb-6 leading-relaxed">
                  Особлива практика гармонізації внутрішнього стану через дихання, звуковидобування та зняття тілесного напруження.
                </p>

                <div className="space-y-3 pt-4 border-t border-[#F4ECFB]">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#463659]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8E6CAE]" />
                    <span>Робота з емоційним станом через голос</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#463659]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8E6CAE]" />
                    <span>Зняття тілесних та голосових затисків</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#463659]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8E6CAE]" />
                    <span>Зниження рівня стресу та відчуття свободи</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#F4ECFB]">
                <button
                  onClick={() => handleSelectPricing('55 хв', 'Вокал як терапія')}
                  className="w-full py-3 rounded-full bg-[#FAF6FD] hover:bg-[#8E6CAE] text-[#6E4B91] hover:text-white font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Обрати цей напрямок</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pricing Section ("Прайс-лист") */}
      <section id="pricing" className="py-20 sm:py-28 bg-[#FFFFFF] border-t border-[#F2E8F8] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-block px-3.5 py-1 rounded-full bg-[#F3E8FA] text-xs font-semibold uppercase tracking-wider text-[#794E9A] mb-3">
              Прайс-лист
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#291A3C] mb-4">
              Прозорі тарифи та абонементи
            </h2>
            <p className="text-base sm:text-lg text-[#615077] font-light">
              Оберіть комфортну тривалість занять. Зручні абонементи для регулярного та стабільного прогресу.
            </p>
          </div>

          {/* Special Banner: "Пробне заняття (45 хв) — 400 грн" */}
          <div className="max-w-3xl mx-auto mb-14">
            <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#7B539F] via-[#9468B3] to-[#B97282] text-white shadow-xl shadow-[#7B539F]/20 overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Subtle visual glow accent */}
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#FFE2E6]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 text-center sm:text-left space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-medium text-white/95">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFE8EC]" />
                  <span>Спеціальна пропозиція для знайомства</span>
                </div>
                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold">
                  Пробне заняття (45 хв) — 400 грн
                </h3>
                <p className="text-xs sm:text-sm text-white/85 max-w-md">
                  Визначимо ваші цілі, оцінимо природний тембр та підберемо індивідуальну програму розвитку.
                </p>
              </div>

              <div className="relative z-10 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => handleSelectPricing('45 хв', 'Пробне заняття')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white text-[#6F4796] hover:bg-[#FDF8FE] font-semibold text-sm shadow-md hover:scale-105 active:scale-100 transition-all cursor-pointer whitespace-nowrap"
                  id="trial-banner-btn"
                >
                  Записатися на пробне
                </button>
              </div>
            </div>
          </div>

          {/* 3 Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Card 1: 30 хвилин */}
            <div
              id="price-card-30"
              className="bg-[#FAF8FD] rounded-3xl p-7 sm:p-8 border border-[#E9DAF5] flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#7D6493]">
                    Експрес формат
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#6F5B85] bg-[#EEDEFA] px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    <span>30 хвилин</span>
                  </div>
                </div>

                <h3 className="font-serif-display text-3xl font-bold text-[#2C1D3E] mb-2">
                  30 хвилин
                </h3>
                <p className="text-xs text-[#6A5A7E] mb-6">
                  Підходить для дітей, швидкого розспівування та відпрацювання конкретних вокальних прийомів.
                </p>

                <div className="space-y-4 py-4 border-y border-[#E9DAF5]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4E3E63]">Разове заняття:</span>
                    <span className="text-base font-bold text-[#2C1D3E]">650 грн</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4E3E63]">Абонемент на 4 заняття:</span>
                    <span className="text-base font-bold text-[#2C1D3E]">2 400 грн</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4E3E63]">Абонемент на 8 занять:</span>
                    <span className="text-base font-bold text-[#7E55A1]">4 600 грн</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handleSelectPricing('30 хв')}
                  className="w-full py-3.5 rounded-full border border-[#7E55A1] text-[#7E55A1] hover:bg-[#7E55A1] hover:text-white font-medium text-sm transition-all cursor-pointer"
                >
                  Обрати 30 хвилин
                </button>
              </div>
            </div>

            {/* Card 2: 45 хвилин */}
            <div
              id="price-card-45"
              className="bg-[#FAF8FD] rounded-3xl p-7 sm:p-8 border border-[#E9DAF5] flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#7D6493]">
                    Оптимальний
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#6F5B85] bg-[#EEDEFA] px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    <span>45 хвилин</span>
                  </div>
                </div>

                <h3 className="font-serif-display text-3xl font-bold text-[#2C1D3E] mb-2">
                  45 хвилин
                </h3>
                <p className="text-xs text-[#6A5A7E] mb-6">
                  Збалансований урок: розминка, дихальні практики та робота над композиціями.
                </p>

                <div className="space-y-4 py-4 border-y border-[#E9DAF5]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4E3E63]">Разове заняття:</span>
                    <span className="text-base font-bold text-[#2C1D3E]">800 грн</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4E3E63]">Абонемент на 4 заняття:</span>
                    <span className="text-base font-bold text-[#2C1D3E]">3 000 грн</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4E3E63]">Абонемент на 8 занять:</span>
                    <span className="text-base font-bold text-[#7E55A1]">5 700 грн</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handleSelectPricing('45 хв')}
                  className="w-full py-3.5 rounded-full border border-[#7E55A1] text-[#7E55A1] hover:bg-[#7E55A1] hover:text-white font-medium text-sm transition-all cursor-pointer"
                >
                  Обрати 45 хвилин
                </button>
              </div>
            </div>

            {/* Card 3 (Featured/Popular): 55 хвилин ⭐ */}
            <div
              id="price-card-55"
              className="relative bg-gradient-to-b from-[#FAF5FF] via-white to-[#FAF5FF] rounded-3xl p-7 sm:p-8 border-2 border-[#B97282] shadow-xl shadow-[#8E6CAE]/15 flex flex-col justify-between transform lg:-translate-y-2 hover:-translate-y-3 transition-all"
            >
              {/* Popular Star Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#7B539F] to-[#B97282] text-white text-xs font-semibold tracking-wide shadow-md flex items-center gap-1.5 whitespace-nowrap">
                <span>⭐ Найпопулярніший вибір</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 mt-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#A75968]">
                    Максимальний результат
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#863D4C] bg-[#FCECEE] px-2.5 py-1 rounded-full font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>55 хвилин</span>
                  </div>
                </div>

                <h3 className="font-serif-display text-3xl font-bold text-[#2C1D3E] mb-2">
                  55 хвилин
                </h3>
                <p className="text-xs text-[#6A5A7E] mb-6">
                  Повноцінний глибокий урок: комплексна розспівка, техніка дихання, детальний аналіз пісні або фортепіанної п'єси.
                </p>

                <div className="space-y-4 py-4 border-y border-[#F3E2E6]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4E3E63]">Разове заняття:</span>
                    <span className="text-base font-bold text-[#2C1D3E]">900 грн</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4E3E63]">Абонемент на 4 заняття:</span>
                    <span className="text-base font-bold text-[#2C1D3E]">3 400 грн</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4E3E63]">Абонемент на 8 занять:</span>
                    <span className="text-base font-bold text-[#B97282]">6 400 грн</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handleSelectPricing('55 хв')}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#7B539F] via-[#8C64AC] to-[#BD7382] text-white font-medium text-sm shadow-md shadow-[#7B539F]/25 hover:shadow-lg hover:opacity-95 transition-all cursor-pointer"
                >
                  Обрати 55 хвилин
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-16 bg-[#FAF8FD] border-t border-[#F2E8F8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#291A3C]">
              Поширені запитання
            </h3>
            <p className="text-sm text-[#6C5B82] mt-1">
              Все, що потрібно знати перед першим заняттям
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[#EDE1F7] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-medium text-sm sm:text-base text-[#342449] hover:text-[#7A519D] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8C7A9E] transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-[#7A519D]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-[#604F75] leading-relaxed border-t border-[#F7F0FC] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Contact & Socials Section ("Контакти") */}
      <section id="contacts" className="py-20 sm:py-28 bg-[#FFFFFF] border-t border-[#EEDEFA] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Contact Details & Instagram Button */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <div className="inline-block px-3.5 py-1 rounded-full bg-[#F3E8FA] text-xs font-semibold uppercase tracking-wider text-[#794E9A] mb-3">
                  Контакти
                </div>
                <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#291A3C] mb-4">
                  Завітайте до простору
                </h2>
                <p className="text-base text-[#615077] leading-relaxed">
                  Залиште заявку на сайті або напишіть в Instagram — я з радістю відповім на всі запитання та допоможу обрати найкращий час для уроку.
                </p>
              </div>

              {/* Location & Details Card */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAF8FD] border border-[#EDE1F7]">
                  <div className="w-12 h-12 rounded-xl bg-[#F0E5FC] text-[#7A519D] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs uppercase tracking-wider font-semibold text-[#8B779E]">
                      Локація
                    </div>
                    <div className="text-base font-semibold text-[#301F44] leading-snug mt-0.5">
                      м. Київ, вул. Максима Кривоноса, 27
                    </div>
                    <div className="text-xs text-[#715F86] mt-1">
                      Затишний творчий простір з комфортними умовами для занять
                    </div>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=%D0%9A%D0%B8%D1%97%D0%B2,+%D0%B2%D1%83%D0%BB.+%D0%9C%D0%B0%D0%BA%D1%81%D0%B8%D0%BC%D0%B0+%D0%9A%D1%80%D0%B8%D0%B2%D0%BE%D0%BD%D0%BE%D1%81%D0%B0,+27"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#7A519D] hover:text-[#9F5D6B] font-medium mt-2 transition-colors"
                    >
                      <span>Відкрити на Google Maps</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF8FD] border border-[#EDE1F7]">
                  <div className="w-12 h-12 rounded-xl bg-[#FCEEF1] text-[#B76E79] flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider font-semibold text-[#8B779E]">
                      Графік занять
                    </div>
                    <div className="text-base font-semibold text-[#301F44]">
                      Понеділок – Субота
                    </div>
                    <div className="text-xs text-[#715F86]">
                      За попереднім індивідуальним записом
                    </div>
                  </div>
                </div>
              </div>

              {/* Instagram Button Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FAF5FE] to-[#FDF4F6] border border-[#E9DAF5] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9B51E0] via-[#E1306C] to-[#FD1D1D] text-white flex items-center justify-center shadow-sm">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#2E1D43]">
                      @vocalcoach_zhanko
                    </div>
                    <div className="text-xs text-[#6F5E84]">
                      Відео з уроків, поради та музичне життя студії
                    </div>
                  </div>
                </div>

                <a
                  href="https://www.instagram.com/vocalcoach_zhanko/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#7B539F] via-[#9F5D6B] to-[#B76E79] text-white font-medium text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
                  id="contact-instagram-link-btn"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Відкрити наш Instagram</span>
                </a>
              </div>
            </div>

            {/* Right: Interactive Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#FAF8FD] rounded-3xl p-6 sm:p-10 border border-[#EADBFA] shadow-lg shadow-[#8E6CAE]/5 relative">
                <div className="mb-8">
                  <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2A1B3F] mb-2">
                    Онлайн-запис на заняття
                  </h3>
                  <p className="text-sm text-[#69587E]">
                    Заповніть форму нижче, і Катерина зв'яжеться з вами для підтвердження часу.
                  </p>
                </div>

                {isSubmitted ? (
                  <div
                    id="form-success-state"
                    className="py-12 px-6 text-center rounded-2xl bg-white border border-[#DCC7F5] shadow-xs space-y-4 animate-in fade-in duration-300"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#F3EAF8] text-[#7A519D] flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8" />
                    </div>
                    <h4 className="font-serif-display text-2xl font-bold text-[#2D1C42]">
                      Дякуємо, {formData.name || 'гостю'}!
                    </h4>
                    <p className="text-sm text-[#5C4C72] max-w-md mx-auto leading-relaxed">
                      Вашу заявку успішно надіслано. Катерина зв'яжеться з вами за номером <strong>{formData.phone}</strong> найближчим часом.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setPhoneInput('');
                          setRawPhoneDigits('');
                          setFormData({
                            name: '',
                            phone: '',
                            service: 'Вокал',
                            duration: '55 хв',
                            comment: ''
                          });
                        }}
                        className="px-6 py-2.5 rounded-full border border-[#D0BAEC] text-[#694A88] text-xs font-semibold hover:bg-[#F3EAF8] transition-colors"
                      >
                        Надіслати ще одну заявку
                      </button>
                      <a
                        href="https://www.instagram.com/vocalcoach_zhanko/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 rounded-full bg-[#7A519D] text-white text-xs font-semibold hover:bg-[#68408A] transition-colors"
                      >
                        Написати в Instagram
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" id="booking-form">
                    {/* Name */}
                    <div>
                      <label htmlFor="user-name" className="block text-xs font-semibold uppercase tracking-wider text-[#5E4D74] mb-2">
                        Ваше ім'я *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#9D8AA8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          id="user-name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Як до вас звертатися?"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-[#E2D2F2] focus:border-[#8E6CAE] focus:ring-2 focus:ring-[#8E6CAE]/20 text-sm text-[#2F2044] outline-none transition-all placeholder:text-[#A798B3]"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label htmlFor="user-phone" className="block text-xs font-semibold uppercase tracking-wider text-[#5E4D74] mb-2">
                        Номер телефону *
                      </label>
                      <div className="flex items-center rounded-2xl bg-white border border-[#E2D2F2] focus-within:border-[#8E6CAE] focus-within:ring-2 focus-within:ring-[#8E6CAE]/20 transition-all overflow-hidden shadow-xs">
                        {/* Fixed +380 prefix */}
                        <div className="flex items-center gap-1.5 px-3.5 py-3.5 bg-[#F6EEFD] border-r border-[#E8DAF7] text-[#4F3968] font-semibold text-sm select-none shrink-0">
                          <span className="text-base" role="img" aria-label="Прапор України">🇺🇦</span>
                          <span className="tracking-wider">+380</span>
                        </div>
                        {/* 9-digit input field */}
                        <input
                          type="tel"
                          id="user-phone"
                          required
                          value={phoneInput}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="(XX) XXX-XX-XX"
                          className="w-full px-4 py-3.5 text-sm text-[#2F2044] outline-none placeholder:text-[#B1A3BC] font-medium tracking-wide"
                          maxLength={15}
                        />
                      </div>
                      <span className="text-[11px] text-[#86739B] mt-1.5 block">
                        Введіть 9 цифр вашого номера (наприклад: 50 123 45 67)
                      </span>
                    </div>

                    {/* Select service (Вокал / Фортепіано / Терапія) */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E4D74] mb-2">
                        Оберіть напрямок *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {['Вокал', 'Фортепіано', 'Вокал як терапія'].map((srv) => {
                          const isSelected = formData.service === srv;
                          return (
                            <button
                              type="button"
                              key={srv}
                              onClick={() => setFormData({ ...formData, service: srv })}
                              className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-medium border text-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#7A519D] text-white border-[#7A519D] shadow-xs'
                                  : 'bg-white text-[#56456A] border-[#E3D3F2] hover:border-[#BFA4DC]'
                              }`}
                            >
                              {srv}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Select duration (30 хв / 45 хв / 55 хв) */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5E4D74] mb-2">
                        Оберіть тривалість *
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {['30 хв', '45 хв', '55 хв'].map((dur) => {
                          const isSelected = formData.duration === dur;
                          return (
                            <button
                              type="button"
                              key={dur}
                              onClick={() => setFormData({ ...formData, duration: dur })}
                              className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-medium border text-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-gradient-to-r from-[#7B539F] to-[#B97282] text-white border-transparent shadow-xs'
                                  : 'bg-white text-[#56456A] border-[#E3D3F2] hover:border-[#BFA4DC]'
                              }`}
                            >
                              {dur}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {submitError && (
                      <div className="p-3 rounded-xl bg-[#FCECEE] border border-[#F6D0D5] text-[#A63F52] text-xs">
                        {submitError}
                      </div>
                    )}

                    {/* Submit button "Записатися на урок" */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-full bg-gradient-to-r from-[#7B539F] via-[#8C64AC] to-[#BD7382] hover:opacity-95 text-white font-semibold text-base shadow-lg shadow-[#7B539F]/25 hover:shadow-xl hover:shadow-[#7B539F]/35 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed"
                      id="submit-booking-btn"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>{isSubmitting ? 'Надсилання...' : 'Записатися на урок'}</span>
                    </button>

                    <p className="text-[11px] text-center text-[#8D7B9F]">
                      Натискаючи кнопку, ви даєте згоду на зв'язок щодо узгодження зручного часу уроку.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#241734] text-[#C8BCD7] py-12 border-t border-[#3B2951]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#3E2C56]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#8E6CAE] flex items-center justify-center text-white">
                <Music className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-serif-display text-xl font-bold text-white block">
                  Творчий простір Катерини Жанько
                </span>
                <span className="text-xs text-[#A898BC]">
                  Уроки вокалу та фортепіано в Києві
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors cursor-pointer">
                Про простір
              </button>
              <button onClick={() => scrollToSection('courses')} className="hover:text-white transition-colors cursor-pointer">
                Напрямки
              </button>
              <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors cursor-pointer">
                Ціни
              </button>
              <button onClick={() => scrollToSection('contacts')} className="hover:text-white transition-colors cursor-pointer">
                Контакти
              </button>
            </div>

            <div>
              <a
                href="https://www.instagram.com/vocalcoach_zhanko/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B2951] hover:bg-[#4E366B] text-white text-xs font-medium transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-[#E598A4]" />
                <span>@vocalcoach_zhanko</span>
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E7E9F]">
            <div>
              © {new Date().getFullYear()} Творчий простір Катерини Жанько. Всі права захищено.
            </div>
            <div>
              м. Київ, вул. Максима Кривоноса, 27 • Музика як шлях до самовираження та гармонії
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
