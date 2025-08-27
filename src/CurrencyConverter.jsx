import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ArrowLeftRight, 
  Star, 
  TrendingUp, 
  Moon, 
  Sun, 
  AlertCircle, 
  RefreshCw, 
  Calendar, 
  Heart, 
  Settings,
  Bell,
  Download,
  Share2,
  Calculator,
  Clock,
  Globe,
  BarChart3,
  Bookmark,
  Filter,
  Search,
  X,
  Plus,
  Trash2,
  Edit,
  Check,
  AlertTriangle,
  Info,
  Zap,
  Activity,
  DollarSign,
  Coins,
  PieChart,
  Brain,
  Sparkles,
  Bitcoin,
  Ruler,
  Weight,
  Square,
  Timer,
  Database,
  Percent,
  Beaker,
  Binary,
  Gauge,
  Thermometer,
  User,
  Layers,
  Scale
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

const ChidiMultiConverter = () => {
  // Core state
  const [rates, setRates] = useState({});
  const [cryptoRates, setCryptoRates] = useState({});
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('1');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  
  // UI state
  const [darkMode, setDarkMode] = useState(() => 
    typeof window !== 'undefined' && (localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [selectedTab, setSelectedTab] = useState('convert'); // convert, crypto, charts, economy, ai, units
  
  // Feature state
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('currencyFavorites') || '[]');
    }
    return [];
  });
  const [alerts, setAlerts] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('currencyAlerts') || '[]');
    }
    return [];
  });
  const [conversionHistory, setConversionHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    }
    return [];
  });
  const [watchlist, setWatchlist] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('currencyWatchlist') || '[]');
    }
    return [];
  });
  
  // Modal states
  const [showHistorical, setShowHistorical] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [showMultiConvert, setShowMultiConvert] = useState(false);
  
  // Advanced features state
  const [historicalData, setHistoricalData] = useState([]);
  const [economicIndicators, setEconomicIndicators] = useState([]);
  const [aiPredictions, setAiPredictions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [multiCurrencies, setMultiCurrencies] = useState(['EUR', 'GBP', 'JPY', 'AUD', 'CAD']);
  const [refreshInterval, setRefreshInterval] = useState(300000); // 5 minutes
  const [precision, setPrecision] = useState(2);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [alertForm, setAlertForm] = useState({ from: 'USD', to: 'EUR', targetRate: '', condition: 'above' });
  
  // Unit Converter State
  const [selectedUnitTab, setSelectedUnitTab] = useState('length');
  const [unitFromValue, setUnitFromValue] = useState('1');
  const [unitFromUnit, setUnitFromUnit] = useState('');
  const [unitToUnit, setUnitToUnit] = useState('');
  const [unitResult, setUnitResult] = useState('');

  // BMI Calculator State
  const [bmiHeight, setBmiHeight] = useState('');
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  const [heightUnit, setHeightUnit] = useState('cm');
  const [weightUnit, setWeightUnit] = useState('kg');

  // API configuration
  const API_KEY = '0cd1b6c193483fff3c3c0838';
  const API_BASE = 'https://v6.exchangerate-api.com/v6';

  // Unit conversion definitions
  const unitConversions = {
    length: {
      name: 'Length',
      icon: Ruler,
      color: 'blue',
      units: {
        // Metric
        mm: { name: 'Millimeter', factor: 0.001, category: 'Metric' },
        cm: { name: 'Centimeter', factor: 0.01, category: 'Metric' },
        m: { name: 'Meter', factor: 1, category: 'Metric' },
        km: { name: 'Kilometer', factor: 1000, category: 'Metric' },
        // Imperial
        in: { name: 'Inch', factor: 0.0254, category: 'Imperial' },
        ft: { name: 'Foot', factor: 0.3048, category: 'Imperial' },
        yd: { name: 'Yard', factor: 0.9144, category: 'Imperial' },
        mi: { name: 'Mile', factor: 1609.344, category: 'Imperial' },
        // Nautical
        nm: { name: 'Nautical Mile', factor: 1852, category: 'Nautical' },
        fathom: { name: 'Fathom', factor: 1.8288, category: 'Nautical' },
        // Other
        mil: { name: 'Mil', factor: 0.0000254, category: 'Other' },
        μm: { name: 'Micrometer', factor: 0.000001, category: 'Other' },
        ly: { name: 'Light Year', factor: 9.461e15, category: 'Astronomical' },
        au: { name: 'Astronomical Unit', factor: 1.496e11, category: 'Astronomical' }
      }
    },
    mass: {
      name: 'Mass & Weight',
      icon: Weight,
      color: 'green',
      units: {
        // Metric
        mg: { name: 'Milligram', factor: 0.000001, category: 'Metric' },
        g: { name: 'Gram', factor: 0.001, category: 'Metric' },
        kg: { name: 'Kilogram', factor: 1, category: 'Metric' },
        t: { name: 'Metric Ton', factor: 1000, category: 'Metric' },
        // Imperial
        oz: { name: 'Ounce', factor: 0.0283495, category: 'Imperial' },
        lb: { name: 'Pound', factor: 0.453592, category: 'Imperial' },
        st: { name: 'Stone', factor: 6.35029, category: 'Imperial' },
        'ton-us': { name: 'US Ton', factor: 907.185, category: 'Imperial' },
        'ton-uk': { name: 'UK Ton', factor: 1016.05, category: 'Imperial' },
        // Other
        ct: { name: 'Carat', factor: 0.0002, category: 'Jewelry' },
        gr: { name: 'Grain', factor: 0.0000647989, category: 'Other' },
        dr: { name: 'Dram', factor: 0.00177185, category: 'Other' }
      }
    },
    area: {
      name: 'Area',
      icon: Square,
      color: 'purple',
      units: {
        // Metric
        'mm²': { name: 'Square Millimeter', factor: 0.000001, category: 'Metric' },
        'cm²': { name: 'Square Centimeter', factor: 0.0001, category: 'Metric' },
        'm²': { name: 'Square Meter', factor: 1, category: 'Metric' },
        'km²': { name: 'Square Kilometer', factor: 1000000, category: 'Metric' },
        ha: { name: 'Hectare', factor: 10000, category: 'Metric' },
        a: { name: 'Are', factor: 100, category: 'Metric' },
        // Imperial
        'in²': { name: 'Square Inch', factor: 0.00064516, category: 'Imperial' },
        'ft²': { name: 'Square Foot', factor: 0.092903, category: 'Imperial' },
        'yd²': { name: 'Square Yard', factor: 0.836127, category: 'Imperial' },
        'mi²': { name: 'Square Mile', factor: 2589988.1, category: 'Imperial' },
        acre: { name: 'Acre', factor: 4046.86, category: 'Imperial' },
        // Other
        barn: { name: 'Barn', factor: 1e-28, category: 'Scientific' }
      }
    },
    time: {
      name: 'Time',
      icon: Timer,
      color: 'orange',
      units: {
        ns: { name: 'Nanosecond', factor: 1e-9, category: 'Sub-second' },
        μs: { name: 'Microsecond', factor: 1e-6, category: 'Sub-second' },
        ms: { name: 'Millisecond', factor: 0.001, category: 'Sub-second' },
        s: { name: 'Second', factor: 1, category: 'Basic' },
        min: { name: 'Minute', factor: 60, category: 'Basic' },
        h: { name: 'Hour', factor: 3600, category: 'Basic' },
        day: { name: 'Day', factor: 86400, category: 'Calendar' },
        week: { name: 'Week', factor: 604800, category: 'Calendar' },
        month: { name: 'Month', factor: 2629746, category: 'Calendar' },
        year: { name: 'Year', factor: 31556952, category: 'Calendar' },
        decade: { name: 'Decade', factor: 315569520, category: 'Long Term' },
        century: { name: 'Century', factor: 3155695200, category: 'Long Term' }
      }
    },
    data: {
      name: 'Data Storage',
      icon: Database,
      color: 'indigo',
      units: {
        bit: { name: 'Bit', factor: 1, category: 'Basic' },
        byte: { name: 'Byte', factor: 8, category: 'Basic' },
        KB: { name: 'Kilobyte', factor: 8192, category: 'Decimal' },
        MB: { name: 'Megabyte', factor: 8388608, category: 'Decimal' },
        GB: { name: 'Gigabyte', factor: 8589934592, category: 'Decimal' },
        TB: { name: 'Terabyte', factor: 8796093022208, category: 'Decimal' },
        PB: { name: 'Petabyte', factor: 9007199254740992, category: 'Decimal' },
        KiB: { name: 'Kibibyte', factor: 8192, category: 'Binary' },
        MiB: { name: 'Mebibyte', factor: 8388608, category: 'Binary' },
        GiB: { name: 'Gibibyte', factor: 8589934592, category: 'Binary' },
        TiB: { name: 'Tebibyte', factor: 8796093022208, category: 'Binary' }
      }
    },
    volume: {
      name: 'Volume',
      icon: Beaker,
      color: 'cyan',
      units: {
        // Metric
        ml: { name: 'Milliliter', factor: 0.001, category: 'Metric' },
        l: { name: 'Liter', factor: 1, category: 'Metric' },
        'cm³': { name: 'Cubic Centimeter', factor: 0.001, category: 'Metric' },
        'm³': { name: 'Cubic Meter', factor: 1000, category: 'Metric' },
        // Imperial
        'fl oz': { name: 'Fluid Ounce (US)', factor: 0.0295735, category: 'US Imperial' },
        'fl oz uk': { name: 'Fluid Ounce (UK)', factor: 0.0284131, category: 'UK Imperial' },
        cup: { name: 'Cup (US)', factor: 0.236588, category: 'US Imperial' },
        pt: { name: 'Pint (US)', factor: 0.473176, category: 'US Imperial' },
        'pt uk': { name: 'Pint (UK)', factor: 0.568261, category: 'UK Imperial' },
        qt: { name: 'Quart (US)', factor: 0.946353, category: 'US Imperial' },
        gal: { name: 'Gallon (US)', factor: 3.78541, category: 'US Imperial' },
        'gal uk': { name: 'Gallon (UK)', factor: 4.54609, category: 'UK Imperial' },
        // Other
        tsp: { name: 'Teaspoon', factor: 0.00492892, category: 'Cooking' },
        tbsp: { name: 'Tablespoon', factor: 0.0147868, category: 'Cooking' },
        'in³': { name: 'Cubic Inch', factor: 0.0163871, category: 'Cubic' },
        'ft³': { name: 'Cubic Foot', factor: 28.3168, category: 'Cubic' },
        'yd³': { name: 'Cubic Yard', factor: 764.555, category: 'Cubic' }
      }
    },
    speed: {
      name: 'Speed',
      icon: Gauge,
      color: 'red',
      units: {
        'km/h': { name: 'Kilometers per Hour', factor: 1, category: 'Metric' },
        'm/s': { name: 'Meters per Second', factor: 3.6, category: 'Metric' },
        'mph': { name: 'Miles per Hour', factor: 0.621371, category: 'Imperial' },
        'ft/s': { name: 'Feet per Second', factor: 1.09728, category: 'Imperial' },
        kn: { name: 'Knot', factor: 0.539957, category: 'Nautical' },
        mach: { name: 'Mach Number', factor: 0.00291545, category: 'Aviation' },
        c: { name: 'Speed of Light', factor: 9.265669311e-10, category: 'Physics' }
      }
    },
    temperature: {
      name: 'Temperature',
      icon: Thermometer,
      color: 'pink',
      units: {
        celsius: { name: 'Celsius', symbol: '°C', category: 'Metric' },
        fahrenheit: { name: 'Fahrenheit', symbol: '°F', category: 'Imperial' },
        kelvin: { name: 'Kelvin', symbol: 'K', category: 'Scientific' },
        rankine: { name: 'Rankine', symbol: '°R', category: 'Scientific' },
        reaumur: { name: 'Réaumur', symbol: '°Ré', category: 'Historical' }
      }
    },
    numeralSystem: {
      name: 'Numeral System',
      icon: Binary,
      color: 'gray',
      bases: {
        2: { name: 'Binary', prefix: '0b' },
        8: { name: 'Octal', prefix: '0o' },
        10: { name: 'Decimal', prefix: '' },
        16: { name: 'Hexadecimal', prefix: '0x' }
      }
    }
  };

  // Enhanced currency information with crypto
  const currencyInfo = {
    // Traditional currencies
    'USD': { name: 'US Dollar', flag: '🇺🇸', region: 'North America', symbol: '$', type: 'fiat' },
    'EUR': { name: 'Euro', flag: '🇪🇺', region: 'Europe', symbol: '€', type: 'fiat' },
    'GBP': { name: 'British Pound', flag: '🇬🇧', region: 'Europe', symbol: '£', type: 'fiat' },
    'JPY': { name: 'Japanese Yen', flag: '🇯🇵', region: 'Asia', symbol: '¥', type: 'fiat' },
    'AUD': { name: 'Australian Dollar', flag: '🇦🇺', region: 'Oceania', symbol: 'A$', type: 'fiat' },
    'CAD': { name: 'Canadian Dollar', flag: '🇨🇦', region: 'North America', symbol: 'C$', type: 'fiat' },
    'CHF': { name: 'Swiss Franc', flag: '🇨🇭', region: 'Europe', symbol: 'Fr', type: 'fiat' },
    'CNY': { name: 'Chinese Yuan', flag: '🇨🇳', region: 'Asia', symbol: '¥', type: 'fiat' },
    'INR': { name: 'Indian Rupee', flag: '🇮🇳', region: 'Asia', symbol: '₹', type: 'fiat' },
    'KRW': { name: 'South Korean Won', flag: '🇰🇷', region: 'Asia', symbol: '₩', type: 'fiat' },
    'BRL': { name: 'Brazilian Real', flag: '🇧🇷', region: 'South America', symbol: 'R$', type: 'fiat' },
    'MXN': { name: 'Mexican Peso', flag: '🇲🇽', region: 'North America', symbol: '$', type: 'fiat' },
    'SGD': { name: 'Singapore Dollar', flag: '🇸🇬', region: 'Asia', symbol: 'S$', type: 'fiat' },
    'HKD': { name: 'Hong Kong Dollar', flag: '🇭🇰', region: 'Asia', symbol: 'HK$', type: 'fiat' },
    'NZD': { name: 'New Zealand Dollar', flag: '🇳🇿', region: 'Oceania', symbol: 'NZ$', type: 'fiat' },
    'SEK': { name: 'Swedish Krona', flag: '🇸🇪', region: 'Europe', symbol: 'kr', type: 'fiat' },
    'NOK': { name: 'Norwegian Krone', flag: '🇳🇴', region: 'Europe', symbol: 'kr', type: 'fiat' },
    'DKK': { name: 'Danish Krone', flag: '🇩🇰', region: 'Europe', symbol: 'kr', type: 'fiat' },
    
    // Cryptocurrencies
    'BTC': { name: 'Bitcoin', flag: '₿', region: 'Crypto', symbol: '₿', type: 'crypto', color: '#F7931A' },
    'ETH': { name: 'Ethereum', flag: 'Ξ', region: 'Crypto', symbol: 'Ξ', type: 'crypto', color: '#627EEA' },
    'BNB': { name: 'Binance Coin', flag: 'BNB', region: 'Crypto', symbol: 'BNB', type: 'crypto', color: '#F0B90B' },
    'ADA': { name: 'Cardano', flag: 'ADA', region: 'Crypto', symbol: 'ADA', type: 'crypto', color: '#0D1E30' },
    'DOT': { name: 'Polkadot', flag: 'DOT', region: 'Crypto', symbol: 'DOT', type: 'crypto', color: '#E6007A' },
    'XRP': { name: 'Ripple', flag: 'XRP', region: 'Crypto', symbol: 'XRP', type: 'crypto', color: '#23292F' },
    'LTC': { name: 'Litecoin', flag: 'Ł', region: 'Crypto', symbol: 'Ł', type: 'crypto', color: '#BFBBBB' },
    'LINK': { name: 'Chainlink', flag: 'LINK', region: 'Crypto', symbol: 'LINK', type: 'crypto', color: '#375BD2' },
    'BCH': { name: 'Bitcoin Cash', flag: 'BCH', region: 'Crypto', symbol: 'BCH', type: 'crypto', color: '#8DC351' },
    'XLM': { name: 'Stellar', flag: 'XLM', region: 'Crypto', symbol: 'XLM', type: 'crypto', color: '#7D00FF' },
  };

  // Mock crypto rates 
  const mockCryptoRates = {
    'BTC': 42500.00,
    'ETH': 2650.00,
    'BNB': 315.50,
    'ADA': 0.485,
    'DOT': 7.25,
    'XRP': 0.62,
    'LTC': 72.80,
    'LINK': 14.75,
    'BCH': 245.60,
    'XLM': 0.125
  };

  // Economic indicators mock data
  const mockEconomicIndicators = [
    { name: 'US GDP Growth', value: '2.1%', change: '+0.3', trend: 'up', impact: 'USD' },
    { name: 'EU Inflation Rate', value: '8.5%', change: '-0.2', trend: 'down', impact: 'EUR' },
    { name: 'UK Interest Rate', value: '5.25%', change: '+0.25', trend: 'up', impact: 'GBP' },
    { name: 'Japan CPI', value: '3.2%', change: '+0.1', trend: 'up', impact: 'JPY' },
    { name: 'China PMI', value: '50.2%', change: '+1.2', trend: 'up', impact: 'CNY' },
    { name: 'Oil Price (WTI)', value: '$85.20', change: '+2.15', trend: 'up', impact: 'Global' },
    { name: 'Gold Price', value: '$1,985', change: '-8.50', trend: 'down', impact: 'Global' },
    { name: 'Bitcoin Fear & Greed', value: '68', change: '+5', trend: 'up', impact: 'Crypto' }
  ];

  // Unit conversion functions
  const convertUnits = useCallback((value, fromUnit, toUnit, type) => {
    if (!value || value === '' || !fromUnit || !toUnit) return '';
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';

    switch (type) {
      case 'temperature':
        return convertTemperature(numValue, fromUnit, toUnit);
      case 'numeralSystem':
        return convertNumeralSystem(value, fromUnit, toUnit);
      default:
        const units = unitConversions[type].units;
        if (!units[fromUnit] || !units[toUnit]) return '';
        
        // Convert to base unit, then to target unit
        const baseValue = numValue * units[fromUnit].factor;
        const result = baseValue / units[toUnit].factor;
        
        return formatResult(result);
    }
  }, []);

  const convertTemperature = (value, from, to) => {
    let celsius;
    
    // Convert to Celsius first
    switch (from) {
      case 'celsius': celsius = value; break;
      case 'fahrenheit': celsius = (value - 32) * 5/9; break;
      case 'kelvin': celsius = value - 273.15; break;
      case 'rankine': celsius = (value - 491.67) * 5/9; break;
      case 'reaumur': celsius = value * 5/4; break;
      default: return '';
    }
    
    // Convert from Celsius to target
    let result;
    switch (to) {
      case 'celsius': result = celsius; break;
      case 'fahrenheit': result = celsius * 9/5 + 32; break;
      case 'kelvin': result = celsius + 273.15; break;
      case 'rankine': result = celsius * 9/5 + 491.67; break;
      case 'reaumur': result = celsius * 4/5; break;
      default: return '';
    }
    
    return formatResult(result);
  };

  const convertNumeralSystem = (value, fromBase, toBase) => {
    try {
      const fromBaseNum = parseInt(fromBase);
      const toBaseNum = parseInt(toBase);
      
      // Convert to decimal first
      const decimal = parseInt(value.toString(), fromBaseNum);
      if (isNaN(decimal)) return '';
      
      // Convert to target base
      const result = decimal.toString(toBaseNum).toUpperCase();
      return result;
    } catch (error) {
      return '';
    }
  };

  const formatResult = (value) => {
    if (Math.abs(value) >= 1e15) return value.toExponential(6);
    if (Math.abs(value) >= 1000000) return value.toExponential(6);
    if (Math.abs(value) < 1e-6 && value !== 0) return value.toExponential(6);
    return parseFloat(value.toPrecision(8)).toString();
  };

  const calculateBMI = useCallback(() => {
    if (!bmiHeight || !bmiWeight) return;
    
    let heightInM = parseFloat(bmiHeight);
    let weightInKg = parseFloat(bmiWeight);
    
    if (isNaN(heightInM) || isNaN(weightInKg) || heightInM <= 0 || weightInKg <= 0) return;
    
    // Convert height to meters
    if (heightUnit === 'ft') {
      heightInM = heightInM * 0.3048;
    } else if (heightUnit === 'in') {
      heightInM = heightInM * 0.0254;
    } else if (heightUnit === 'cm') {
      heightInM = heightInM / 100;
    }
    
    // Convert weight to kg
    if (weightUnit === 'lb') {
      weightInKg = weightInKg * 0.453592;
    }
    
    const bmi = weightInKg / (heightInM * heightInM);
    let category = '';
    let color = '';
    
    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-blue-500';
    } else if (bmi < 25) {
      category = 'Normal weight';
      color = 'text-green-500';
    } else if (bmi < 30) {
      category = 'Overweight';
      color = 'text-yellow-500';
    } else if (bmi < 35) {
      category = 'Obesity Class I';
      color = 'text-orange-500';
    } else if (bmi < 40) {
      category = 'Obesity Class II';
      color = 'text-red-500';
    } else {
      category = 'Obesity Class III';
      color = 'text-red-700';
    }
    
    setBmiResult({
      bmi: bmi.toFixed(1),
      category,
      color
    });
  }, [bmiHeight, bmiWeight, heightUnit, weightUnit]);

  const calculateDiscount = (originalPrice, discountPercent, taxRate = 0) => {
    if (!originalPrice || !discountPercent) return null;
    
    const original = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);
    const tax = parseFloat(taxRate) || 0;
    
    if (isNaN(original) || isNaN(discount) || original <= 0 || discount < 0) return null;
    
    const discountAmount = (original * discount) / 100;
    const discountedPrice = original - discountAmount;
    const taxAmount = (discountedPrice * tax) / 100;
    const finalPrice = discountedPrice + taxAmount;
    
    return {
      original: original.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      discountedPrice: discountedPrice.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
      savings: discountAmount.toFixed(2),
      savingsPercent: discount.toFixed(1)
    };
  };

  // Fetch exchange rates from API
  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/${API_KEY}/latest/${baseCurrency}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.result !== 'success') {
        throw new Error(data['error-type'] || 'Failed to fetch rates');
      }
      
      // Combine fiat and crypto rates
      const combinedRates = { ...data.conversion_rates };
      
      // Add crypto rates (mock data)
      Object.entries(mockCryptoRates).forEach(([crypto, rate]) => {
        combinedRates[crypto] = rate / data.conversion_rates.USD;
      });
      
      setRates(combinedRates);
      setCryptoRates(mockCryptoRates);
      setCurrencies(Object.keys(combinedRates).sort());
      setLastUpdated(new Date().toLocaleString());
      
      // Generate chart data
      generateChartData(combinedRates);
      
      // Generate AI predictions
      generateAIPredictions(combinedRates);
      
      showNotification('Exchange rates updated successfully!', 'success');
      
    } catch (err) {
      const errorMessage = `Failed to fetch exchange rates: ${err.message}`;
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [baseCurrency]);

  // Generate chart data for visualizations
  const generateChartData = (currentRates) => {
    const data = [];
    const popularPairs = ['EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'BTC', 'ETH'];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dataPoint = {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toISOString().split('T')[0]
      };
      
      popularPairs.forEach(currency => {
        if (currentRates[currency]) {
          const baseRate = currentRates[currency];
          const variation = (Math.random() - 0.5) * 0.05; // ±5% variation
          dataPoint[currency] = (baseRate * (1 + variation)).toFixed(4);
        }
      });
      
      data.push(dataPoint);
    }
    
    setChartData(data);
  };

  // AI Prediction Algorithm (Simple Moving Average + Trend Analysis)
  const generateAIPredictions = (currentRates) => {
    const predictions = [];
    const currencies = ['EUR', 'GBP', 'JPY', 'BTC', 'ETH'];
    
    currencies.forEach(currency => {
      if (currentRates[currency]) {
        // Simple trend analysis
        const currentRate = currentRates[currency];
        const historicalAverage = currentRate * (0.95 + Math.random() * 0.1); // Mock historical data
        const trend = currentRate > historicalAverage ? 'bullish' : 'bearish';
        const confidence = 70 + Math.random() * 25; // 70-95% confidence
        
        // Predict next 7 days
        const prediction = [];
        for (let i = 1; i <= 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          
          const trendFactor = trend === 'bullish' ? 1.002 : 0.998;
          const randomFactor = 0.995 + Math.random() * 0.01;
          const predictedRate = currentRate * Math.pow(trendFactor * randomFactor, i);
          
          prediction.push({
            date: date.toLocaleDateString(),
            rate: predictedRate.toFixed(6),
            confidence: Math.max(confidence - i * 3, 50) // Decreasing confidence over time
          });
        }
        
        predictions.push({
          currency,
          currentRate: currentRate.toFixed(6),
          trend,
          confidence: confidence.toFixed(1),
          prediction,
          recommendation: trend === 'bullish' ? 'Consider buying' : 'Consider selling',
          riskLevel: confidence > 80 ? 'Low' : confidence > 65 ? 'Medium' : 'High'
        });
      }
    });
    
    setAiPredictions(predictions);
  };

  // Fetch historical data
  const fetchHistoricalData = useCallback(async (days = 30) => {
    try {
      setLoading(true);
      const historicalRates = [];
      
      const currentRate = rates[toCurrency] / rates[fromCurrency];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Simulate realistic rate fluctuations
        const variation = (Math.random() - 0.5) * 0.02;
        const rate = currentRate * (1 + variation);
        
        historicalRates.push({
          date: date.toISOString().split('T')[0],
          rate: rate.toFixed(6),
          change: i === days - 1 ? 0 : ((rate / (historicalRates[historicalRates.length - 1]?.rate || rate) - 1) * 100).toFixed(2)
        });
      }
      
      setHistoricalData(historicalRates);
    } catch (err) {
      showNotification('Failed to fetch historical data', 'error');
    } finally {
      setLoading(false);
    }
  }, [rates, fromCurrency, toCurrency]);

  // Initialize app
  useEffect(() => {
    fetchRates();
    setEconomicIndicators(mockEconomicIndicators);
    
    // Set up auto-refresh interval
    const interval = setInterval(fetchRates, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchRates, refreshInterval]);

  // Initialize default units
  useEffect(() => {
    if (!unitFromUnit && unitConversions[selectedUnitTab]) {
      const units = Object.keys(unitConversions[selectedUnitTab].units || unitConversions[selectedUnitTab].bases || {});
      if (units.length > 0) {
        setUnitFromUnit(units[0]);
        setUnitToUnit(units[1] || units[0]);
      }
    }
  }, [selectedUnitTab, unitFromUnit]);

  // Apply dark mode class to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, [darkMode]);

  // Save preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currencyFavorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
    }
  }, [conversionHistory]);

  // Unit conversion effect
  useEffect(() => {
    if (selectedUnitTab && unitFromValue && unitFromUnit && unitToUnit) {
      const result = convertUnits(unitFromValue, unitFromUnit, unitToUnit, selectedUnitTab);
      setUnitResult(result);
    } else {
      setUnitResult('');
    }
  }, [unitFromValue, unitFromUnit, unitToUnit, selectedUnitTab, convertUnits]);

  // BMI calculation effect
  useEffect(() => {
    calculateBMI();
  }, [calculateBMI]);

  // Convert currency and save to history
  const convertCurrency = useCallback(() => {
    if (!amount || !rates[fromCurrency] || !rates[toCurrency]) return;
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    const result = (numAmount / fromRate) * toRate;
    
    setConvertedAmount(result.toFixed(precision));
    
    // Add to conversion history
    const conversion = {
      id: Date.now(),
      from: fromCurrency,
      to: toCurrency,
      amount: numAmount,
      result: result.toFixed(precision),
      rate: (toRate / fromRate).toFixed(6),
      timestamp: new Date().toISOString()
    };
    
    setConversionHistory(prev => [conversion, ...prev.slice(0, 49)]);
    
  }, [amount, fromCurrency, toCurrency, rates, precision]);

  useEffect(() => {
    convertCurrency();
  }, [convertCurrency]);

  // Utility functions
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    showNotification('Currencies swapped!', 'info');
  };

  const swapUnits = () => {
    setUnitFromUnit(unitToUnit);
    setUnitToUnit(unitFromUnit);
    showNotification('Units swapped!', 'info');
  };

  const toggleFavorite = (pair) => {
    const pairKey = `${pair.from}-${pair.to}`;
    const exists = favorites.some(fav => `${fav.from}-${fav.to}` === pairKey);
    
    if (exists) {
      setFavorites(favorites.filter(fav => `${fav.from}-${fav.to}` !== pairKey));
      showNotification('Removed from favorites', 'info');
    } else {
      setFavorites([...favorites, { ...pair, id: Date.now() }]);
      showNotification('Added to favorites', 'success');
    }
  };

  // Current exchange rate
  const currentRate = useMemo(() => {
    if (!rates[fromCurrency] || !rates[toCurrency]) return '';
    return (rates[toCurrency] / rates[fromCurrency]).toFixed(6);
  }, [rates, fromCurrency, toCurrency]);

  // Multi-currency conversions
  const multiConversions = useMemo(() => {
    if (!amount || !rates[fromCurrency]) return [];
    
    return multiCurrencies.map(currency => {
      if (currency === fromCurrency) return null;
      const result = (parseFloat(amount) / rates[fromCurrency]) * rates[currency];
      return {
        currency,
        amount: result.toFixed(precision),
        name: currencyInfo[currency]?.name || currency,
        symbol: currencyInfo[currency]?.symbol || '',
        flag: currencyInfo[currency]?.flag || '',
        type: currencyInfo[currency]?.type || 'fiat',
        color: currencyInfo[currency]?.color
      };
    }).filter(Boolean);
  }, [amount, rates, fromCurrency, multiCurrencies, precision]);

  // Component functions for special calculators
  const DiscountCalculatorComponent = () => {
    const [originalPrice, setOriginalPrice] = useState('');
    const [discountPercent, setDiscountPercent] = useState('');
    const [taxRate, setTaxRate] = useState('0');
    const [discountResult, setDiscountResult] = useState(null);

    useEffect(() => {
      const result = calculateDiscount(originalPrice, discountPercent, taxRate);
      setDiscountResult(result);
    }, [originalPrice, discountPercent, taxRate]);

    return (
      <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3">
            <Percent className="h-8 w-8 text-green-500" />
            Discount & Tax Calculator
          </h3>
          <p className="text-gray-600 dark:text-gray-300">Calculate savings, discounts, and final prices</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              Original Price ($)
            </label>
            <input
              type="number"
              placeholder="Enter original price"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full p-4 border-2 border-green-200 dark:border-green-800 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white text-xl font-bold"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              Discount (%)
            </label>
            <input
              type="number"
              placeholder="Enter discount %"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="w-full p-4 border-2 border-red-200 dark:border-red-800 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white text-xl font-bold"
              step="0.01"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              Tax Rate (%)
            </label>
            <input
              type="number"
              placeholder="Enter tax rate"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              className="w-full p-4 border-2 border-blue-200 dark:border-blue-800 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white text-xl font-bold"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {discountResult && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Original Price:</span>
                  <span className="font-bold text-gray-900 dark:text-white">${discountResult.original}</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl border border-red-200/50 dark:border-red-800/50">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-red-700 dark:text-red-300">Discount Amount:</span>
                  <span className="font-bold text-red-900 dark:text-red-100">-${discountResult.discountAmount}</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-700 dark:text-blue-300">Tax Amount:</span>
                  <span className="font-bold text-blue-900 dark:text-blue-100">+${discountResult.taxAmount}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                <div className="text-center">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">Final Price</p>
                  <p className="text-4xl font-bold text-green-900 dark:text-green-100">${discountResult.finalPrice}</p>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200/50 dark:border-yellow-800/50">
                <div className="text-center">
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-1">Total Savings</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">${discountResult.savings}</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">({discountResult.savingsPercent}% off)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const BMICalculatorComponent = () => {
    return (
      <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3">
            <User className="h-8 w-8 text-emerald-500" />
            BMI Calculator
          </h3>
          <p className="text-gray-600 dark:text-gray-300">Body Mass Index calculator with health indicators</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              Height
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Enter height"
                value={bmiHeight}
                onChange={(e) => setBmiHeight(e.target.value)}
                className="flex-1 p-4 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white text-xl font-bold"
                step="0.01"
                min="0"
              />
              <select
                value={heightUnit}
                onChange={(e) => setHeightUnit(e.target.value)}
                className="p-4 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white font-bold"
              >
                <option value="cm">cm</option>
                <option value="m">m</option>
                <option value="ft">ft</option>
                <option value="in">in</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              Weight
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Enter weight"
                value={bmiWeight}
                onChange={(e) => setBmiWeight(e.target.value)}
                className="flex-1 p-4 border-2 border-teal-200 dark:border-teal-800 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white text-xl font-bold"
                step="0.01"
                min="0"
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                className="p-4 border-2 border-teal-200 dark:border-teal-800 rounded-xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white font-bold"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>
        </div>

        {bmiResult && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800">
              <div className="text-center">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">Your BMI</p>
                <p className="text-5xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">{bmiResult.bmi}</p>
                <p className={`text-xl font-semibold ${bmiResult.color}`}>{bmiResult.category}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-4">BMI Categories:</h4>
              <div className="space-y-2">
                {[
                  { range: 'Below 18.5', category: 'Underweight', color: 'text-blue-500' },
                  { range: '18.5 - 24.9', category: 'Normal weight', color: 'text-green-500' },
                  { range: '25.0 - 29.9', category: 'Overweight', color: 'text-yellow-500' },
                  { range: '30.0 - 34.9', category: 'Obesity Class I', color: 'text-orange-500' },
                  { range: '35.0 - 39.9', category: 'Obesity Class II', color: 'text-red-500' },
                  { range: '40.0+', category: 'Obesity Class III', color: 'text-red-700' }
                ].map((item, index) => (
                  <div key={index} className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-800 ${
                    bmiResult.category === item.category ? 'ring-2 ring-emerald-400 dark:ring-emerald-500' : ''
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{item.range}</span>
                      <span className={`font-semibold ${item.color}`}>{item.category}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                  <strong>Disclaimer:</strong> BMI is a screening tool and doesn't directly measure body fat. 
                  It may not accurately reflect health status for athletes, elderly, or individuals with different body compositions. 
                  Consult healthcare professionals for comprehensive health assessment.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading && !rates.USD) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Sparkles className="animate-pulse h-16 w-16 text-yellow-400 mx-auto mb-6" />
            <RefreshCw className="animate-spin h-12 w-12 text-blue-400 mx-auto mb-4 absolute top-2 left-1/2 transform -translate-x-1/2" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Chidi Multi-Converter</h2>
          <p className="text-lg font-medium text-blue-200 mb-2">Loading real-time rates...</p>
          <p className="text-sm text-purple-200">Connecting to global markets</p>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl backdrop-blur-xl border ${
          notification.type === 'success' 
            ? 'bg-green-500/90 text-white border-green-400'
            : notification.type === 'error'
            ? 'bg-red-500/90 text-white border-red-400'
            : 'bg-blue-500/90 text-white border-blue-400'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <Check className="h-5 w-5" /> : 
             notification.type === 'error' ? <AlertTriangle className="h-5 w-5" /> : 
             <Info className="h-5 w-5" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-50"></div>
              <div className="relative bg-white dark:bg-gray-800 p-4 rounded-full shadow-2xl">
                <DollarSign className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Chidi Multi-Converter
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
                Professional Currency, Crypto & Unit Converter
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-gray-800 dark:text-white">{currencies.length}</span>
                <span className="text-gray-600 dark:text-gray-400">Currencies</span>
              </div>
            </div>
            <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
              <div className="flex items-center gap-2">
                <Bitcoin className="h-5 w-5 text-orange-500" />
                <span className="font-semibold text-gray-800 dark:text-white">10</span>
                <span className="text-gray-600 dark:text-gray-400">Cryptocurrencies</span>
              </div>
            </div>
            <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-gray-800 dark:text-white">Real-time</span>
                <span className="text-gray-600 dark:text-gray-400">Updates</span>
              </div>
            </div>
            {lastUpdated && (
              <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-purple-500" />
                  <span className="font-semibold text-gray-800 dark:text-white text-sm">Last updated:</span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{lastUpdated}</span>
                </div>
              </div>
            )}
          </div>

          {/* Header Controls */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 hover:bg-white dark:hover:bg-black/60 transition-all"
            >
              {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-blue-500" />}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 hover:bg-white dark:hover:bg-black/60 transition-all"
            >
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Settings</span>
            </button>

            <button
              onClick={fetchRates}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-xl transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="font-medium">Refresh Rates</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'convert', label: 'Currency Converter', icon: ArrowLeftRight },
                { id: 'crypto', label: 'Cryptocurrency', icon: Bitcoin },
                { id: 'charts', label: 'Market Charts', icon: BarChart3 },
                { id: 'economy', label: 'Economic Data', icon: TrendingUp },
                { id: 'ai', label: 'AI Predictions', icon: Brain },
                { id: 'units', label: 'Unit Converter', icon: Ruler }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      selectedTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        {selectedTab === 'convert' && (
          <div className="space-y-8">
            {/* Currency Converter */}
            <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Currency Exchange
                </h2>
                <p className="text-gray-600 dark:text-gray-300">Convert between 180+ currencies with real-time rates</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8 items-end mb-8">
                {/* From Currency */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    From Currency
                  </label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full p-4 border-2 border-purple-200 dark:border-purple-800 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white mb-4"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>
                        {currencyInfo[currency]?.flag} {currency} - {currencyInfo[currency]?.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-6 border-2 border-purple-200 dark:border-purple-800 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white text-2xl font-bold"
                    step="any"
                    min="0"
                  />
                </div>

                {/* Swap Button */}
                <div className="flex justify-center lg:mb-16">
                  <button
                    onClick={swapCurrencies}
                    className="group p-6 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white rounded-full shadow-2xl transition-all transform hover:scale-110 hover:rotate-180 duration-300"
                  >
                    <ArrowLeftRight className="h-8 w-8 group-hover:animate-pulse" />
                  </button>
                </div>

                {/* To Currency */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    To Currency
                  </label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full p-4 border-2 border-pink-200 dark:border-pink-800 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white mb-4"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>
                        {currencyInfo[currency]?.flag} {currency} - {currencyInfo[currency]?.name}
                      </option>
                    ))}
                  </select>
                  <div className="w-full p-6 border-2 border-pink-200 dark:border-pink-800 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-white text-2xl font-bold">
                    {convertedAmount || '0.00'}
                  </div>
                </div>
              </div>

              {/* Exchange Rate Display */}
              {currentRate && (
                <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 mb-8">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      1 {currencyInfo[fromCurrency]?.flag} {fromCurrency} = {currentRate} {currencyInfo[toCurrency]?.flag} {toCurrency}
                    </div>
                    <button
                      onClick={() => toggleFavorite({ from: fromCurrency, to: toCurrency })}
                      className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Star className={`h-5 w-5 ${
                        favorites.some(fav => fav.from === fromCurrency && fav.to === toCurrency)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-400'
                      }`} />
                    </button>
                  </div>
                </div>
              )}

              {/* Multi-Currency Display */}
              {multiConversions.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                    <Globe className="h-6 w-6 text-blue-500" />
                    Multi-Currency Conversion
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {multiConversions.map((conversion, index) => (
                      <div key={index} className="p-4 bg-gradient-to-br from-white/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{conversion.flag}</span>
                            <span className="font-semibold text-gray-800 dark:text-white">{conversion.currency}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            conversion.type === 'crypto'
                              ? 'bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200'
                              : 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                          }`}>
                            {conversion.type?.toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {conversion.symbol}{conversion.amount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Units Tab */}
        {selectedTab === 'units' && (
          <div className="space-y-8">
            {/* Units Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                Unit Converter Hub
              </h2>
              <p className="text-gray-600 dark:text-gray-300">Professional-grade conversion tools for all measurements</p>
            </div>

            {/* Unit Type Tabs */}
            <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20">
              <div className="flex flex-wrap gap-2 mb-8">
                {Object.entries(unitConversions).map(([key, converter]) => {
                  const IconComponent = converter.icon;
                  const isActive = selectedUnitTab === key;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedUnitTab(key);
                        setUnitFromUnit('');
                        setUnitToUnit('');
                        setUnitFromValue('1');
                        setUnitResult('');
                      }}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive
                          ? `bg-gradient-to-r from-${converter.color}-500 to-${converter.color}-600 text-white shadow-lg scale-105`
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      {converter.name}
                    </button>
                  );
                })}
                {/* Special tabs for discount, numeral system, and BMI */}
                <button
                  onClick={() => setSelectedUnitTab('discount')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedUnitTab === 'discount'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Percent className="h-5 w-5" />
                  Discount
                </button>
                <button
                  onClick={() => setSelectedUnitTab('numeralSystem')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedUnitTab === 'numeralSystem'
                      ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Binary className="h-5 w-5" />
                  Number Base
                </button>
                <button
                  onClick={() => setSelectedUnitTab('bmi')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedUnitTab === 'bmi'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <User className="h-5 w-5" />
                  BMI Calculator
                </button>
              </div>

              {/* Unit Converter Content */}
              {selectedUnitTab !== 'discount' && selectedUnitTab !== 'numeralSystem' && selectedUnitTab !== 'bmi' && selectedUnitTab !== 'temperature' && (
                <div className="grid md:grid-cols-3 gap-8 items-end">
                  {/* From Unit */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                      From Unit
                    </label>
                    <select
                      value={unitFromUnit}
                      onChange={(e) => setUnitFromUnit(e.target.value)}
                      className="w-full p-4 border-2 border-purple-200 dark:border-purple-800 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white mb-4"
                    >
                      <option value="">Select unit...</option>
                      {unitConversions[selectedUnitTab] && Object.entries(unitConversions[selectedUnitTab].units).map(([key, unit]) => (
                        <option key={key} value={key}>
                          {key} - {unit.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Enter value"
                      value={unitFromValue}
                      onChange={(e) => setUnitFromValue(e.target.value)}
                      className="w-full p-6 border-2 border-purple-200 dark:border-purple-800 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white text-2xl font-bold"
                      step="any"
                    />
                  </div>

                  {/* Swap Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={swapUnits}
                      className="group p-6 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white rounded-full shadow-2xl transition-all transform hover:scale-110 hover:rotate-180 duration-300"
                    >
                      <ArrowLeftRight className="h-8 w-8 group-hover:animate-pulse" />
                    </button>
                  </div>

                  {/* To Unit */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                      To Unit
                    </label>
                    <select
                      value={unitToUnit}
                      onChange={(e) => setUnitToUnit(e.target.value)}
                      className="w-full p-4 border-2 border-pink-200 dark:border-pink-800 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white mb-4"
                    >
                      <option value="">Select unit...</option>
                      {unitConversions[selectedUnitTab] && Object.entries(unitConversions[selectedUnitTab].units).map(([key, unit]) => (
                        <option key={key} value={key}>
                          {key} - {unit.name}
                        </option>
                      ))}
                    </select>
                    <div className="w-full p-6 border-2 border-pink-200 dark:border-pink-800 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-white text-2xl font-bold">
                      {unitResult || '0'}
                    </div>
                  </div>
                </div>
              )}

              {/* Temperature Converter */}
              {selectedUnitTab === 'temperature' && (
                <div className="grid md:grid-cols-3 gap-8 items-end">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                      From Temperature
                    </label>
                    <select
                      value={unitFromUnit}
                      onChange={(e) => setUnitFromUnit(e.target.value)}
                      className="w-full p-4 border-2 border-purple-200 dark:border-purple-800 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white mb-4"
                    >
                      <option value="">Select scale...</option>
                      {Object.entries(unitConversions.temperature.units).map(([key, unit]) => (
                        <option key={key} value={key}>
                          {unit.name} ({unit.symbol})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Enter temperature"
                      value={unitFromValue}
                      onChange={(e) => setUnitFromValue(e.target.value)}
                      className="w-full p-6 border-2 border-purple-200 dark:border-purple-800 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white text-2xl font-bold"
                      step="any"
                    />
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={swapUnits}
                      className="group p-6 bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 hover:from-pink-600 hover:via-red-600 hover:to-orange-600 text-white rounded-full shadow-2xl transition-all transform hover:scale-110 hover:rotate-180 duration-300"
                    >
                      <Thermometer className="h-8 w-8 group-hover:animate-pulse" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                      To Temperature
                    </label>
                    <select
                      value={unitToUnit}
                      onChange={(e) => setUnitToUnit(e.target.value)}
                      className="w-full p-4 border-2 border-pink-200 dark:border-pink-800 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white mb-4"
                    >
                      <option value="">Select scale...</option>
                      {Object.entries(unitConversions.temperature.units).map(([key, unit]) => (
                        <option key={key} value={key}>
                          {unit.name} ({unit.symbol})
                        </option>
                      ))}
                    </select>
                    <div className="w-full p-6 border-2 border-pink-200 dark:border-pink-800 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-white text-2xl font-bold">
                      {unitResult ? `${unitResult}${unitToUnit ? unitConversions.temperature.units[unitToUnit]?.symbol || '' : ''}` : '0'}
                    </div>
                  </div>
                </div>
              )}

              {/* Numeral System Converter */}
              {selectedUnitTab === 'numeralSystem' && (
                <div className="grid md:grid-cols-3 gap-8 items-end">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                      From Base
                    </label>
                    <select
                      value={unitFromUnit}
                      onChange={(e) => setUnitFromUnit(e.target.value)}
                      className="w-full p-4 border-2 border-purple-200 dark:border-purple-800 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white mb-4"
                    >
                      <option value="">Select base...</option>
                      {Object.entries(unitConversions.numeralSystem.bases).map(([key, base]) => (
                        <option key={key} value={key}>
                          Base {key} ({base.name})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Enter number"
                      value={unitFromValue}
                      onChange={(e) => setUnitFromValue(e.target.value)}
                      className="w-full p-6 border-2 border-purple-200 dark:border-purple-800 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white text-2xl font-bold font-mono"
                    />
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={swapUnits}
                      className="group p-6 bg-gradient-to-br from-gray-500 via-slate-600 to-gray-700 hover:from-gray-600 hover:via-slate-700 hover:to-gray-800 text-white rounded-full shadow-2xl transition-all transform hover:scale-110 hover:rotate-180 duration-300"
                    >
                      <Binary className="h-8 w-8 group-hover:animate-pulse" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                      To Base
                    </label>
                    <select
                      value={unitToUnit}
                      onChange={(e) => setUnitToUnit(e.target.value)}
                      className="w-full p-4 border-2 border-pink-200 dark:border-pink-800 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white mb-4"
                    >
                      <option value="">Select base...</option>
                      {Object.entries(unitConversions.numeralSystem.bases).map(([key, base]) => (
                        <option key={key} value={key}>
                          Base {key} ({base.name})
                        </option>
                      ))}
                    </select>
                    <div className="w-full p-6 border-2 border-pink-200 dark:border-pink-800 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-white text-2xl font-bold font-mono">
                      {unitResult || '0'}
                    </div>
                  </div>
                </div>
              )}

              {/* Discount Calculator */}
              {selectedUnitTab === 'discount' && (
                <DiscountCalculatorComponent />
              )}

              {/* BMI Calculator */}
              {selectedUnitTab === 'bmi' && (
                <BMICalculatorComponent />
              )}
            </div>

            {/* Unit Conversion Reference */}
            {unitConversions[selectedUnitTab] && selectedUnitTab !== 'discount' && selectedUnitTab !== 'bmi' && (
              <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                  <Layers className="h-6 w-6 text-indigo-500" />
                  {unitConversions[selectedUnitTab].name} Reference
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {unitConversions[selectedUnitTab].units && Object.entries(
                    Object.entries(unitConversions[selectedUnitTab].units)
                      .reduce((acc, [key, unit]) => {
                        if (!acc[unit.category]) acc[unit.category] = {};
                        acc[unit.category][key] = unit;
                        return acc;
                      }, {})
                  ).map(([category, units]) => (
                    <div key={category} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3 text-sm border-b border-gray-200 dark:border-gray-600 pb-2">
                        {category}
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(units).map(([key, unit]) => (
                          <div key={key} className="flex justify-between items-center text-xs">
                            <span className="font-mono text-gray-600 dark:text-gray-400">{key}</span>
                            <span className="text-gray-500 dark:text-gray-500 truncate ml-2">{unit.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Settings & Preferences
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                      Base Currency for Rates
                    </label>
                    <select
                      value={baseCurrency}
                      onChange={(e) => setBaseCurrency(e.target.value)}
                      className="w-full p-4 border-2 border-purple-200 dark:border-purple-800 rounded-xl bg-white/80 dark:bg-black/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500"
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>
                          {currencyInfo[currency]?.flag} {currency} - {currencyInfo[currency]?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                      Decimal Precision
                    </label>
                    <select
                      value={precision}
                      onChange={(e) => setPrecision(parseInt(e.target.value))}
                      className="w-full p-4 border-2 border-purple-200 dark:border-purple-800 rounded-xl bg-white/80 dark:bg-black/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500"
                    >
                      <option value={2}>2 decimal places (Standard)</option>
                      <option value={4}>4 decimal places (Precise)</option>
                      <option value={6}>6 decimal places (Ultra Precise)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                      Auto Refresh Interval
                    </label>
                    <select
                      value={refreshInterval}
                      onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                      className="w-full p-4 border-2 border-purple-200 dark:border-purple-800 rounded-xl bg-white/80 dark:bg-black/50 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500"
                    >
                      <option value={60000}>1 minute (Real-time)</option>
                      <option value={300000}>5 minutes (Standard)</option>
                      <option value={600000}>10 minutes (Battery Saver)</option>
                      <option value={1800000}>30 minutes (Minimal)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    Multi-Currency Display
                  </label>
                  <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
                    {['EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'BTC', 'ETH', 'BNB', 'ADA'].map(currency => (
                      <label key={currency} className="flex items-center p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={multiCurrencies.includes(currency)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setMultiCurrencies([...multiCurrencies, currency]);
                            } else {
                              setMultiCurrencies(multiCurrencies.filter(c => c !== currency));
                            }
                          }}
                          className="mr-3 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <span className="text-lg">{currencyInfo[currency]?.flag}</span>
                          {currency} - {currencyInfo[currency]?.name}
                          {currencyInfo[currency]?.type === 'crypto' && (
                            <span className="px-2 py-1 bg-orange-200 dark:bg-orange-800 rounded text-xs font-semibold text-orange-800 dark:text-orange-200">
                              CRYPTO
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowSettings(false);
                    showNotification('Settings saved successfully!', 'success');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChidiMultiConverter;