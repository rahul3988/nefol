import { useState } from 'react'
import Logo from '../components/Logo'

const ingredients = [
  {
    id: 'blue-tea',
    name: 'Blue Tea (Aprajita)',
    image: '/IMAGES/blue pea.png',
    description: `Known by various names across India — Blue Tea, Blue Pea, Aprajita (in Hindi), or Shankhpushpi in Ayurvedic tradition — this vibrant flower is more than just visually striking. Rich in powerful antioxidants such as anthocyanins, flavonoids, and polyphenols, Blue Tea is celebrated for its skin-brightening, anti-inflammatory, and soothing properties.

**Antioxidant Protection & Skin Radiance**
Blue Tea is particularly rich in anthocyanins, compounds that help neutralize free radicals and protect the skin from oxidative stress caused by UV exposure and environmental pollution. This not only prevents premature aging but also revives dull, tired-looking skin, promoting a naturally radiant and even-toned complexion.

**Anti-Inflammatory and Calming Effects**
Traditionally used in Ayurveda to calm the nervous system, Blue Tea also offers soothing benefits for the skin. Its bioactive compounds help reduce inflammation, making it effective for calming redness, irritation, and sensitivity.

**Skin Tone Improvement and Detoxification**
The flower's detoxifying properties assist in purifying the skin from within, helping to eliminate toxins and reduce the appearance of blemishes and uneven skin tone. With regular use, it helps reveal a healthier, more luminous complexion.

**Supports Collagen and Elasticity**
Thanks to its antioxidant profile, Blue Tea helps maintain skin structure by protecting collagen and elastin from breakdown. This promotes firmer, more resilient skin over time.`
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    image: '/IMAGES/charcoal.png',
    description: `Charcoal, especially in its activated form, is a skincare powerhouse known for its deep-cleansing and purifying properties. With its naturally porous structure and vast surface area, charcoal acts like a magnet for dirt, oil, and impurities, drawing them out from deep within the pores.

**Detoxifies and Purifies**
Charcoal binds to toxins, pollutants, and excess sebum, effectively decongesting clogged pores and helping prevent breakouts. It's especially beneficial for oily or acne-prone skin, leaving it feeling clean, balanced, and refreshed.

**Controls Oil and Prevents Acne**
By absorbing excess oil produced by the skin, charcoal helps balance sebum levels, making it ideal for those struggling with shine or acne. Its ability to reduce bacteria on the skin further supports a clearer, healthier complexion.

**Gentle Exfoliation**
The mild gritty texture of charcoal provides natural exfoliation, helping to lift away dead skin cells and improve skin texture. This reveals smoother, brighter skin without stripping it of its natural moisture.

**Soothes and Calms**
Though known for its detox powers, charcoal also has calming effects. It may help reduce inflammation and irritation by removing surface irritants, making it suitable even for sensitive or blemish-prone skin.`
  },
  {
    id: 'yuja',
    name: 'Yuja (Citron)',
    image: '/IMAGES/Yuja.png',
    description: `Bursting with vitamin C and natural antioxidants, Yuja is a citrus fruit revered in traditional Eastern remedies and modern skincare alike. Known for its brightening and protective qualities, Yuja helps bring out your skin's natural glow while defending it from daily environmental stressors.

**Brightens and Evens Skin Tone**
Rich in ascorbic acid (vitamin C), Yuja helps neutralize free radicals and protect skin cells from oxidative damage caused by UV rays and pollution. It also helps fade hyperpigmentation, dark spots, and uneven skin tone by inhibiting tyrosinase, the enzyme responsible for melanin production—leading to a more radiant, luminous complexion.

**Powerful Antioxidant Defense**
Beyond vitamin C, Yuja contains flavonoids and phenolic acids that work in synergy to fight oxidative stress. These antioxidants strengthen the skin's barrier, preventing premature aging and inflammation.

**Boosts Collagen for Firmer Skin**
Vitamin C is essential for collagen synthesis. By supporting the enzymes that stabilize and build collagen, Yuja promotes firmer, plumper skin and helps reduce the appearance of fine lines.

**Soothes and Protects**
Yuja also has anti-inflammatory and antibacterial properties, helping to calm irritation and support skin health—especially when exposed to environmental aggressors.`
  },
  {
    id: 'grapeseed',
    name: 'Grapeseed Extract',
    image: '/IMAGES/grapseed.png',
    description: `Lightweight yet incredibly potent, Grapeseed Extract is packed with antioxidants, essential fatty acids, and vitamin E, making it a multitasking hero for skin that needs hydration, protection, and renewal. Derived from the seeds of grapes, this botanical powerhouse is especially loved for its ability to nourish without clogging pores.

**Antioxidant-Rich & Anti-Aging**
Loaded with proanthocyanidins and flavonoids, Grapeseed Extract helps defend skin against free radicals and environmental damage, reducing the appearance of fine lines, wrinkles, and age spots. These antioxidants also support collagen production, improving skin firmness and elasticity over time.

**Deep Hydration Without Heaviness**
Rich in omega-6 fatty acids and vitamin E, grapeseed oil provides lightweight moisturization that absorbs quickly, leaving skin soft, smooth, and nourished—without feeling greasy.

**Soothes Acne-Prone and Sensitive Skin**
With its low comedogenic rating, Grapeseed Extract is gentle enough for oily or acne-prone skin. It helps balance sebum, reduce redness and inflammation, and supports clear, calm skin.

**Fades Dark Spots and Scars**
The powerful combination of antioxidants and vitamin E works to lighten hyperpigmentation, diminish acne scars, and promote a more even, radiant skin tone.

**Strengthens and Protects**
Thanks to compounds like resveratrol and oligomeric proanthocyanidins, Grapeseed Extract helps fortify the skin against UV damage and other environmental stressors—leaving your skin resilient and glowing.`
  },
  {
    id: 'shea-butter',
    name: 'Shea Butter',
    image: '/IMAGES/shea butter.png',
    description: `A rich, nourishing ingredient long treasured in African skincare traditions, Shea Butter is a luxurious emollient packed with essential fatty acids, vitamins, and anti-inflammatory compounds. Known for its ability to deeply hydrate, soothe, and protect, it's a true multitasker for restoring the skin's barrier and maintaining a healthy glow.

**Intense Moisture & Skin Barrier Repair**
With a high concentration of oleic, stearic, linoleic, and palmitic acids, Shea Butter mimics the skin's natural lipids, helping to restore and strengthen the skin barrier. It delivers long-lasting hydration, keeping skin soft, smooth, and supple.

**Calms Inflammation & Soothes Irritation**
Rich in triterpenes like lupeol and amyrins, Shea Butter exhibits powerful anti-inflammatory effects. It helps reduce redness, irritation, and sensitivity, making it ideal for conditions like rosacea, eczema, or post-exfoliation care.

**Anti-Aging & Antioxidant Support**
Shea Butter contains vitamin E, vitamin A, and cinnamic acid derivatives that help neutralize free radicals, reducing the visible signs of premature aging such as fine lines and dullness.

**Gentle and Non-Comedogenic**
Despite being deeply nourishing, Shea Butter is non-comedogenic for most skin types, meaning it hydrates without clogging pores. It's suitable for dry, sensitive, and even acne-prone skin when used in balanced formulations.`
  },
  {
    id: 'mulberry',
    name: 'Mulberry Extract',
    image: '/IMAGES/mulberry.png',
    description: `A gentle yet powerful botanical, Mulberry extract is rich in antioxidants, vitamins, and skin-brightening compounds that help promote a clear, even-toned, and youthful complexion. Used in traditional skincare remedies and now supported by modern research, Mulberry is especially valued for its ability to fade dark spots and calm irritation.

**Brightens Skin and Reduces Hyperpigmentation**
Mulberry is a natural tyrosinase inhibitor, helping to slow down melanin production. This makes it highly effective at lightening dark spots, blemishes, and uneven skin tone, leaving skin looking more luminous and radiant.

**Powerful Antioxidant Protection**
Packed with antioxidants like anthocyanins, flavonoids (rutin and quercetin), resveratrol, and vitamin C, Mulberry helps protect the skin from free radicals, UV damage, and premature aging, keeping your complexion youthful and vibrant.

**Anti-Aging Benefits**
By supporting collagen health and fighting oxidative stress, Mulberry extract helps reduce the appearance of fine lines and wrinkles while improving skin elasticity.

**Acne and Blemish Control**
Thanks to its antibacterial and anti-inflammatory properties, Mulberry can help regulate sebum production, soothe irritation, and reduce breakouts—making it a gentle solution for acne-prone or sensitive skin.

**Soothing and Hydrating**
Mulberry is also hydrating and calming, helping to relieve dry, irritated skin while enhancing your skin's natural glow.`
  }
]

export default function Ingredients() {
  const [selectedIngredient, setSelectedIngredient] = useState(ingredients[0])
  const [showText, setShowText] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [clickedImage, setClickedImage] = useState<string | null>(null)

  const handleImageClick = (ingredient: typeof ingredients[0]) => {
    setClickedImage(ingredient.id)
    setIsAnimating(true)
    
    // Start the skyrocket animation
    setTimeout(() => {
      setSelectedIngredient(ingredient)
      setShowText(true)
      setIsAnimating(false)
    }, 800) // Animation duration
  }

  const handleCloseText = () => {
    setShowText(false)
    setClickedImage(null)
  }

  return (
    <main className="py-10 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-100">Explore Our Ingredients</h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-400">
            At Nefol, we use natural, effective, and skin-friendly ingredients that are carefully selected for their benefits. 
            Every product is made with love, care, and science — free from harsh chemicals, parabens, and toxins.
          </p>
        </div>

        {/* Full-width Image Gallery */}
        <div className="space-y-4">
          {ingredients.map((ingredient) => (
            <div key={ingredient.id} className="relative">
              <button
                onClick={() => handleImageClick(ingredient)}
                className={`group relative w-full overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                  clickedImage === ingredient.id && isAnimating ? 'skyrocket-animation' : ''
                }`}
                disabled={isAnimating}
              >
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className={`h-96 w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    clickedImage === ingredient.id && isAnimating ? 'animate-pulse' : ''
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-bold text-white">{ingredient.name}</h3>
                </div>
                
                {/* Skyrocket Animation Overlay */}
                {clickedImage === ingredient.id && isAnimating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="skyrocket-explosion">
                      <div className="explosion-circle"></div>
                      <div className="explosion-particles">
                        <div className="particle particle-1"></div>
                        <div className="particle particle-2"></div>
                        <div className="particle particle-3"></div>
                        <div className="particle particle-4"></div>
                        <div className="particle particle-5"></div>
                        <div className="particle particle-6"></div>
                        <div className="particle particle-7"></div>
                        <div className="particle particle-8"></div>
                      </div>
                      <div className="explosion-text">
                        <Logo className="h-16 w-auto" href="#" />
                      </div>
                    </div>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Text Overlay */}
        {showText && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white dark:bg-slate-800 p-8 shadow-2xl">
              <button
                onClick={handleCloseText}
                className="absolute right-4 top-4 text-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                ×
              </button>
              <h2 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">{selectedIngredient.name}</h2>
              <div className="prose prose-slate max-w-none text-lg leading-relaxed dark:prose-invert">
                {selectedIngredient.description.split('\n\n').map((paragraph, index) => (
                  <div key={index} className="mb-6">
                    {paragraph.split('**').map((part, partIndex) => {
                      if (partIndex % 2 === 1) {
                        return <strong key={partIndex} className="font-bold text-slate-900 dark:text-slate-100">{part}</strong>
                      }
                      return <span key={partIndex}>{part}</span>
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Skyrocket Animation Styles */}
      <style jsx>{`
        .skyrocket-animation {
          animation: skyrocket 0.8s ease-out;
        }
        
        @keyframes skyrocket {
          0% {
            transform: scale(1);
            filter: brightness(1);
          }
          20% {
            transform: scale(1.05);
            filter: brightness(1.2);
          }
          40% {
            transform: scale(1.1);
            filter: brightness(1.5);
          }
          60% {
            transform: scale(1.15);
            filter: brightness(1.8);
          }
          80% {
            transform: scale(1.2);
            filter: brightness(2);
          }
          100% {
            transform: scale(1.25);
            filter: brightness(2.5);
          }
        }
        
        .skyrocket-explosion {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .explosion-circle {
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
          animation: explosion-circle 0.8s ease-out;
        }
        
        @keyframes explosion-circle {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }
        
        .explosion-particles {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: linear-gradient(45deg, #ff6b6b, #ffd93d, #6bcf7f, #4d9de0);
          border-radius: 50%;
          animation: particle-explosion 0.8s ease-out;
        }
        
        .particle-1 { top: 50%; left: 50%; animation-delay: 0.1s; }
        .particle-2 { top: 30%; left: 70%; animation-delay: 0.2s; }
        .particle-3 { top: 70%; left: 30%; animation-delay: 0.3s; }
        .particle-4 { top: 20%; left: 50%; animation-delay: 0.4s; }
        .particle-5 { top: 80%; left: 50%; animation-delay: 0.5s; }
        .particle-6 { top: 50%; left: 20%; animation-delay: 0.6s; }
        .particle-7 { top: 50%; left: 80%; animation-delay: 0.7s; }
        .particle-8 { top: 40%; left: 40%; animation-delay: 0.8s; }
        
        @keyframes particle-explosion {
          0% {
            transform: scale(0) translate(0, 0);
            opacity: 1;
          }
          50% {
            transform: scale(1) translate(var(--random-x, 50px), var(--random-y, 50px));
            opacity: 0.8;
          }
          100% {
            transform: scale(0.5) translate(var(--random-x, 100px), var(--random-y, 100px));
            opacity: 0;
          }
        }
        
        .particle-1 { --random-x: 60px; --random-y: -40px; }
        .particle-2 { --random-x: 80px; --random-y: -20px; }
        .particle-3 { --random-x: -60px; --random-y: 40px; }
        .particle-4 { --random-x: 0px; --random-y: -60px; }
        .particle-5 { --random-x: 0px; --random-y: 60px; }
        .particle-6 { --random-x: -80px; --random-y: 0px; }
        .particle-7 { --random-x: 80px; --random-y: 0px; }
        .particle-8 { --random-x: -40px; --random-y: -40px; }
        
        .explosion-text {
          animation: text-bounce 0.8s ease-out;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .explosion-text img {
          filter: drop-shadow(0 0 20px rgba(255,255,255,0.8));
          animation: logo-glow 0.8s ease-out;
        }
        
        @keyframes logo-glow {
          0% {
            filter: drop-shadow(0 0 0px rgba(255,255,255,0));
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(255,255,255,1));
          }
          100% {
            filter: drop-shadow(0 0 20px rgba(255,255,255,0.8));
          }
        }
        
        @keyframes text-bounce {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          30% {
            transform: scale(1.2) rotate(180deg);
            opacity: 1;
          }
          60% {
            transform: scale(0.9) rotate(360deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }
      `}</style>
    </main>
  )
}


