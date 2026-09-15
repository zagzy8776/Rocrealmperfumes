export const FAQ_GROUPS = [
  {
    title: 'Ordering, delivery and payment',
    items: [
      {
        question: 'Do you deliver in Owerri?',
        answer:
          'Yes. Roc Realm Perfumes delivers across Owerri, including Uratta, New Owerri, Ikenegbu, Douglas Road, Wetheral Road, MCC Road and World Bank. Owerri delivery is ₦3,000 and is coordinated by rider after your order is confirmed.',
      },
      {
        question: 'Do you deliver to Port Harcourt, Onitsha, Anambra and Enugu?',
        answer:
          'Yes. We deliver to Port Harcourt and Rivers State, Onitsha and Anambra State, and Enugu State. Park dispatch or waybill costs 1,000 to send your order to the park, and any remaining rider cost is confirmed with you before dispatch. Other states are coordinated based on destination.',
      },
      {
        question: 'Can I pay on delivery?',
        answer:
          'Pay on delivery may be available depending on your location and order. You can also pay by bank transfer or confirm your order on WhatsApp at checkout.',
      },
      {
        question: 'Can I pick up my order from the store?',
        answer:
          'Yes. Pickup is free from our store at Prof Avenue Junction, by Spibat Road, Uratta, Owerri, Imo State. We confirm as soon as your order is packed.',
      },
      {
        question: 'How do I place an order?',
        answer:
          'Add the perfumes you want to your cart and check out with your name, phone number and delivery details. Your order is saved and sent to our WhatsApp line for confirmation, so you always speak to a real person before paying.',
      },
    ],
  },
  {
    title: 'Original perfumes and authenticity',
    items: [
      {
        question: 'Are your perfumes original?',
        answer:
          'Yes. Every perfume we sell is an original designer or Arabian fragrance sourced from trusted suppliers. We do not sell diluted or refilled bottles.',
      },
      {
        question: 'How can I tell an original perfume from a fake?',
        answer:
          'Check the batch code, the weight and finish of the bottle, the spray quality, how well the cap fits, and how the scent develops. Original fragrances move through top, heart and base notes instead of smelling flat from the first spray. Our fragrance journal explains how to spot fake perfume in Nigeria.',
      },
      {
        question: 'Do you sell perfume oils as well as sprays?',
        answer:
          'Yes. We stock roll-on perfume oils, attars, eau de parfum sprays, body mists and hair mists. Oil perfumes sit closer to the skin and often last longer, while sprays project further.',
      },
      {
        question: 'Are the perfumes long lasting?',
        answer:
          'Longevity depends on the concentration and your skin. Oil perfumes, eau de parfum and oud-based fragrances generally last longest. We can recommend the most long-lasting options for your budget on WhatsApp.',
      },
    ],
  },
  {
    title: 'Choosing the right perfume',
    items: [
      {
        question: 'Can you recommend a perfume for me?',
        answer:
          'Yes. Send us your budget, gender preference, scent mood and the occasion on WhatsApp, or use our perfume finder quiz in Owerri and we will suggest options that fit.',
      },
      {
        question: 'What perfumes are trending right now?',
        answer:
          'Trending notes include vanilla gourmand, pistachio, coconut, cherry, aquatic, jasmine, vetiver, oud and unisex blends. We keep the latest trending Arabian and designer fragrances in stock.',
      },
      {
        question: 'Do you have vanilla and pistachio perfumes?',
        answer:
          'Yes. We carry a wide range of vanilla gourmand fragrances, pistachio perfumes, vanilla body mists and sweet gourmand blends, which are some of our most requested scents.',
      },
      {
        question: 'Which perfume is best for hot Nigerian weather?',
        answer:
          'Fresh, airy scents work best in Nigerian heat and harmattan: citrus, aquatic, clean musk, sea salt and soft florals. Save dense oud, gourmand and heavy amber scents for evenings or cooler settings.',
      },
      {
        question: 'Do you have unisex fragrances?',
        answer:
          'Yes. Unisex fragrances are a large part of our collection, especially fresh citrus, oud, amber and musk blends that work on anyone.',
      },
    ],
  },
  {
    title: 'Gifts and luxury sets',
    items: [
      {
        question: 'Do you sell perfume gift sets?',
        answer:
          'Yes. We have gift-ready perfume sets, oil perfumes, body mists, reed diffusers, humidifiers and home scents. You can pick them from the shop or request a curated gift on WhatsApp.',
      },
      {
        question: 'Can you gift-wrap or deliver a surprise?',
        answer:
          'Yes. Tell us it is a gift on WhatsApp and we will coordinate presentation and delivery, including sending a surprise directly to the recipient in Owerri, Port Harcourt, Onitsha, Anambra or Enugu.',
      },
      {
        question: 'What is a good perfume gift for a birthday or anniversary?',
        answer:
          'For her, floral, vanilla, sweet and soft musk scents work beautifully. For him, fresh, woody, amber and oud scents are reliable. Gift sets that combine a perfume with a diffuser or body mist feel more complete.',
      },
    ],
  },
  {
    title: 'Buying from Roc Realm Perfumes',
    items: [
      {
        question: 'Why buy from Roc Realm Perfumes instead of a street vendor?',
        answer:
          'Roc Realm Perfumes is a registered store, Roc Realm Nigeria Limited, based in Owerri, Imo State. You get original fragrances, scent advice before you buy, confirmed delivery, and a person who answers your call or WhatsApp.',
      },
      {
        question: 'How do I contact Roc Realm Perfumes?',
        answer:
          'Call the store line on 08085100229, message WhatsApp on +234 908 478 2126, or email rocrealmnigerialimited@gmail.com. Our Owerri store is open Monday to Saturday, 9am to 8pm.',
      },
    ],
  },
];

export const FAQ_ITEMS = FAQ_GROUPS.flatMap((group) => group.items);

export const FAQ_ITEMS_BY_TITLES = (titles = []) =>
  FAQ_GROUPS.filter((group) => titles.includes(group.title)).flatMap((group) => group.items);

export const HOME_FAQ_TITLES = [
  'Ordering, delivery and payment',
  'Original perfumes and authenticity',
  'Choosing the right perfume',
];

export const HOME_FAQ_ITEMS = FAQ_ITEMS_BY_TITLES(HOME_FAQ_TITLES);