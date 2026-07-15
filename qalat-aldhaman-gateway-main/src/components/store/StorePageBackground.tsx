/**
 * ديكور خلفية مشترك بكل صفحات المتجر: التدرّج اللوني + كتل ضبابية كبيرة وواضحة بألوان
 * العلامة التجارية (شفافية 20-28%). التدرّج والـ blobs يعيشان بنفس العنصر الثابت (fixed
 * -z-10) عمداً — لو انفصل التدرّج لعنصر عادي (non-positioned) بصفحة أخرى فوق هذا العنصر،
 * فسيُرسم فوق الـ blobs ويُخفيها تماماً بسبب ترتيب الطلاء بين المحتوى العادي والعناصر
 * السالبة z-index (جُرِّب هذا وتأكد أنه يُخفي الخلفية فعلياً عبر لقطة شاشة حقيقية).
 */
const StorePageBackground = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-page-gradient">
    <div className="absolute -top-20 -left-20 w-80 h-80 sm:w-[28rem] sm:h-[28rem] lg:w-[36rem] lg:h-[36rem] rounded-full bg-primary/25 blur-3xl" />
    <div className="absolute top-1/4 -right-24 w-80 h-80 sm:w-[26rem] sm:h-[26rem] lg:w-[34rem] lg:h-[34rem] rounded-full bg-accent/[0.22] blur-3xl" />
    <div className="absolute -bottom-28 left-1/4 w-72 h-72 sm:w-96 sm:h-96 lg:w-[30rem] lg:h-[30rem] rounded-full bg-secondary/20 blur-3xl" />
  </div>
);

export default StorePageBackground;
