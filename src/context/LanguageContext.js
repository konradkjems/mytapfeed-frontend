import React, { createContext, useContext, useState } from 'react';

// Definer oversættelser
export const translations = {
  da: {
    // Dashboard
    dashboard: 'Dashboard',
    totalTrafficOverview: 'Samlet trafik oversigt',
    months: 'Måneder',
    clicks: 'Antal klik',
    products: 'Produkter',
    addNewProduct: 'Tilføj Nyt Produkt',
    noProductsYet: 'Ingen produkter tilføjet endnu',
    productId: 'Produkt ID',
    name: 'Navn',
    redirectUrl: 'Redirect URL',
    productType: 'Produkttype',
    actions: 'Handlinger',
    save: 'Gem',
    edit: 'Rediger',
    delete: 'Slet',
    cancel: 'Annuller',
    add: 'Tilføj',

    // Google Reviews
    googleMapsReviews: 'Google Maps Anmeldelser',
    averageRating: 'Gennemsnitlig vurdering',
    basedOn: 'Baseret på',
    reviews: 'anmeldelser',
    latestReviews: 'Seneste anmeldelser',
    noReviews: 'Ingen anmeldelser at vise',
    seeAllReviews: 'Se alle anmeldelser',
    manageLocation: 'Administrer lokation',
    changeLocation: 'Skift lokation',
    logoutGoogle: 'Log ud af Google Business',
    connectBusiness: 'Tilknyt din virksomhed',
    newestFirst: 'Nyeste først',
    oldestFirst: 'Ældste først',
    phone: 'Telefon',
    visitWebsite: 'Besøg hjemmeside',
    noBusinessData: 'Ingen virksomhedsdata tilgængelig',

    // Statistics
    topProducts: 'Top 5 mest besøgte produkter',
    clicksByType: 'Klik per produkttype',
    productCount: 'Antal produkter',
    totalClicks: 'Samlet antal klik',
    average: 'Gennemsnit',

    // Product Types
    stander: 'Stander',
    sticker: 'Sticker',
    kort: 'Kort',
    plate: 'Plate',

    // Tooltips
    tooltips: {
      productId: "Dette er det unikke ID for dit produkt. Det bruges i QR-koden og URL'en.",
      name: "Et valgfrit navn til at identificere dit produkt. F.eks. 'Butik Vestergade Kasse 1'",
      tapfeedUrl: "Den URL som QR-koden vil pege på. Dette er den URL der skal scannes.",
      redirectUrl: "Den URL som brugeren bliver sendt til når de scanner QR-koden.",
      productType: "Vælg hvilken type produkt dette er. Dette hjælper med at organisere dine produkter.",
      clicks: "Antal gange QR-koden er blevet scannet.",
      qrCode: "Download QR-koden for dette produkt.",
      edit: "Rediger produktets information.",
      delete: "Slet dette produkt permanent.",
      addProduct: "Opret et nyt produkt med QR-kode.",
      googleReviews: "Se og administrer dine Google anmeldelser.",
      statistics: "Se statistik over dine produkters performance.",
      monthlyTraffic: "Grafisk oversigt over antal scanninger per måned for alle dine produkter.",
      topProducts: "Liste over dine 5 mest scannede produkter sorteret efter antal scanninger.",
      productTypeStats: "Oversigt over hvordan dine produkter performer fordelt på produkttype.",
      totalClicks: "Det samlede antal scanninger for denne produkttype.",
      avgClicks: "Gennemsnitligt antal scanninger per produkt af denne type.",
      productCount: "Antal produkter du har af denne type."
    },

    // Menu items
    menu: {
      dashboard: 'Dashboard',
      statistics: 'Statistik',
      profile: 'Min Profil',
      admin: 'Admin Panel'
    }
  },
  en: {
    // Dashboard
    dashboard: 'Dashboard',
    totalTrafficOverview: 'Total Traffic Overview',
    months: 'Months',
    clicks: 'Clicks',
    products: 'Products',
    addNewProduct: 'Add New Product',
    noProductsYet: 'No products added yet',
    productId: 'Product ID',
    name: 'Name',
    redirectUrl: 'Redirect URL',
    productType: 'Product Type',
    actions: 'Actions',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    add: 'Add',

    // Google Reviews
    googleMapsReviews: 'Google Maps Reviews',
    averageRating: 'Average Rating',
    basedOn: 'Based on',
    reviews: 'reviews',
    latestReviews: 'Latest Reviews',
    noReviews: 'No reviews to show',
    seeAllReviews: 'See all reviews',
    manageLocation: 'Manage Location',
    changeLocation: 'Change Location',
    logoutGoogle: 'Logout from Google Business',
    connectBusiness: 'Connect your Business',
    newestFirst: 'Newest First',
    oldestFirst: 'Oldest First',
    phone: 'Phone',
    visitWebsite: 'Visit Website',
    noBusinessData: 'No business data available',

    // Statistics
    topProducts: 'Top 5 Most Visited Products',
    clicksByType: 'Clicks by Product Type',
    productCount: 'Product Count',
    totalClicks: 'Total Clicks',
    average: 'Average',

    // Product Types
    stander: 'Stand',
    sticker: 'Sticker',
    kort: 'Card',
    plate: 'Plate',

    // Tooltips
    tooltips: {
      productId: "This is the unique ID for your product. It's used in the QR code and URL.",
      name: "An optional name to identify your product. E.g. 'Shop Main Street Register 1'",
      tapfeedUrl: "The URL that the QR code will point to. This is the URL to be scanned.",
      redirectUrl: "The URL that users will be redirected to when they scan the QR code.",
      productType: "Choose what type of product this is. This helps organize your products.",
      clicks: "Number of times the QR code has been scanned.",
      qrCode: "Download the QR code for this product.",
      edit: "Edit the product's information.",
      delete: "Permanently delete this product.",
      addProduct: "Create a new product with QR code.",
      googleReviews: "View and manage your Google reviews.",
      statistics: "View statistics about your products' performance.",
      monthlyTraffic: "Graphical overview of scans per month for all your products.",
      topProducts: "List of your 5 most scanned products sorted by number of scans.",
      productTypeStats: "Overview of how your products perform by product type.",
      totalClicks: "The total number of scans for this product type.",
      avgClicks: "Average number of scans per product of this type.",
      productCount: "Number of products you have of this type."
    },

    // Menu items
    menu: {
      dashboard: 'Dashboard',
      statistics: 'Statistics',
      profile: 'My Profile',
      admin: 'Admin Panel'
    }
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('da'); // Default sprog er dansk

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'da' ? 'en' : 'da');
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 