/**
 * Kanjealo V5 - Core Client-Side Backend & State Engine (Vanilla JS)
 * Handles storage, business logic, tourist passes, redemption codes, and admin auth.
 * Compatible with Live Server (http://127.0.0.1:5500/) and static hosts.
 */
(function() {
  'use strict';

  const STORAGE_KEYS = {
    COUPONS: 'kanjealo_coupons',
    PASSES: 'kanjealo_passes',
    ACTIVE_PASS_ID: 'kanjealo_active_pass_id',
    REDEMPTIONS: 'kanjealo_redemptions',
    USERS: 'kanjealo_users',
    ADMIN_SESSION: 'kanjealo_admin_session'
  };

  const CATEGORIES = {
    'restaurantes': ['Restaurantes', '🍽️'],
    'casas-de-cambio': ['Casas de cambio', '💱'],
    'alquiler-de-vehiculos': ['Alquiler de vehículos', '🚗'],
    'excursiones': ['Excursiones', '🚌'],
    'experiencias': ['Experiencias', '✨'],
    'compras': ['Compras', '🛍️']
  };

  const PLANS = {
    '24h': { hours: 24, price: 3, label: 'Kanjealo 24 horas' },
    '48h': { hours: 48, price: 5, label: 'Kanjealo 48 horas' }
  };

  const BENEFIT_TYPES = {
    'atencion': 'Atención / regalo',
    'descuento': 'Descuento'
  };

  const SEED_COUPONS = [
    {
      id: 1,
      category: 'restaurantes',
      rubro: 'Gastronomía',
      business_name: 'La Trattoria',
      benefit_type: 'atencion',
      benefit_text: 'Una botella de vino de regalo',
      discount_percent: 0,
      description: 'Beneficio sujeto a disponibilidad.',
      address: 'Rambla de las Américas 123, Colonia',
      maps_url: 'https://maps.google.com/?q=Colonia+del+Sacramento',
      whatsapp: '+59800000000',
      minimum_purchase: '$ 2.000',
      estimated_savings: 8,
      code: 'KANJEA123',
      valid_until: '31/12/2026',
      image_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80',
      active: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      category: 'casas-de-cambio',
      rubro: 'Cambio de moneda',
      benefit_type: 'descuento',
      benefit_text: 'Tasa preferencial en tu cambio',
      discount_percent: 0,
      description: 'Consultar condiciones de la operación.',
      address: 'Av. General Flores 456, Colonia',
      maps_url: 'https://maps.google.com/?q=Av+General+Flores+Colonia+Uruguay',
      whatsapp: '+59800000000',
      minimum_purchase: '$ 500',
      estimated_savings: 6,
      code: 'KANJEA456',
      valid_until: '30/12/2026',
      image_url: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=900&q=80',
      active: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      category: 'alquiler-de-vehiculos',
      rubro: 'Rent a car',
      benefit_type: 'atencion',
      benefit_text: 'GPS sin costo',
      discount_percent: 0,
      description: 'Sujeto a disponibilidad de vehículos.',
      address: 'Rambla Portuaria s/n, Colonia',
      maps_url: 'https://maps.google.com/?q=Rambla+Portuaria+Colonia+Uruguay',
      whatsapp: '+59800000000',
      minimum_purchase: '$ 1.500',
      estimated_savings: 10,
      code: 'KANJEA789',
      valid_until: '15/12/2026',
      image_url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80',
      active: 1,
      created_at: new Date().toISOString()
    }
  ];

  function getJSON(key, defaultVal) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    } catch (e) {
      console.error('Error reading localStorage for ' + key, e);
      return defaultVal;
    }
  }

  function setJSON(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error('Error writing localStorage for ' + key, e);
    }
  }

  function generateHex(length) {
    let result = '';
    const chars = '0123456789ABCDEF';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const Kanjealo = {
    CATEGORIES,
    PLANS,
    BENEFIT_TYPES,

    init: function() {
      if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
        setJSON(STORAGE_KEYS.COUPONS, SEED_COUPONS);
      }
      if (!localStorage.getItem(STORAGE_KEYS.PASSES)) {
        setJSON(STORAGE_KEYS.PASSES, []);
      }
      if (!localStorage.getItem(STORAGE_KEYS.REDEMPTIONS)) {
        setJSON(STORAGE_KEYS.REDEMPTIONS, []);
      }
      if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        setJSON(STORAGE_KEYS.USERS, [
          { id: 1, username: 'admin', password: 'admin123' }
        ]);
      }
      this.getActivePass(); // triggers expiry check
      this.updateHeaderNav();
    },

    // --- Cupones ---
    getCoupons: function(category = 'todos', activeOnly = true) {
      const all = getJSON(STORAGE_KEYS.COUPONS, []);
      return all.filter(c => {
        if (activeOnly && !c.active) return false;
        if (category && category !== 'todos' && c.category !== category) return false;
        return true;
      });
    },

    getCoupon: function(id) {
      const all = getJSON(STORAGE_KEYS.COUPONS, []);
      return all.find(c => String(c.id) === String(id)) || null;
    },

    saveCoupon: function(data, id = null) {
      const all = getJSON(STORAGE_KEYS.COUPONS, []);
      const code = (data.code || '').trim().toUpperCase();
      if (!data.category || !data.business_name || !code) {
        throw new Error('Completá rubro/categoría, establecimiento y código de canje.');
      }

      const duplicate = all.find(c => c.code === code && (!id || String(c.id) !== String(id)));
      if (duplicate) {
        throw new Error('El código ya existe.');
      }

      if (id) {
        const index = all.findIndex(c => String(c.id) === String(id));
        if (index === -1) throw new Error('Cupón no encontrado.');
        all[index] = {
          ...all[index],
          category: data.category,
          rubro: (data.rubro || '').trim(),
          business_name: (data.business_name || '').trim(),
          benefit_type: data.benefit_type || 'atencion',
          benefit_text: (data.benefit_text || '').trim(),
          discount_percent: parseFloat(data.discount_percent || 0),
          description: (data.description || '').trim(),
          address: (data.address || '').trim(),
          maps_url: (data.maps_url || '').trim(),
          whatsapp: (data.whatsapp || '').trim(),
          minimum_purchase: (data.minimum_purchase || '').trim(),
          estimated_savings: parseFloat(data.estimated_savings || 0),
          code: code,
          valid_until: (data.valid_until || '').trim(),
          image_url: (data.image_url || '').trim(),
          active: data.active ? 1 : 0
        };
      } else {
        const nextId = all.reduce((max, c) => Math.max(max, c.id || 0), 0) + 1;
        const newCoupon = {
          id: nextId,
          category: data.category,
          rubro: (data.rubro || '').trim(),
          business_name: (data.business_name || '').trim(),
          benefit_type: data.benefit_type || 'atencion',
          benefit_text: (data.benefit_text || '').trim(),
          discount_percent: parseFloat(data.discount_percent || 0),
          description: (data.description || '').trim(),
          address: (data.address || '').trim(),
          maps_url: (data.maps_url || '').trim(),
          whatsapp: (data.whatsapp || '').trim(),
          minimum_purchase: (data.minimum_purchase || '').trim(),
          estimated_savings: parseFloat(data.estimated_savings || 0),
          code: code,
          valid_until: (data.valid_until || '').trim(),
          image_url: (data.image_url || '').trim(),
          active: data.active !== undefined ? (data.active ? 1 : 0) : 1,
          created_at: new Date().toISOString()
        };
        all.unshift(newCoupon);
      }
      setJSON(STORAGE_KEYS.COUPONS, all);
    },

    deleteCoupon: function(id) {
      let all = getJSON(STORAGE_KEYS.COUPONS, []);
      all = all.filter(c => String(c.id) !== String(id));
      setJSON(STORAGE_KEYS.COUPONS, all);

      let redemptions = getJSON(STORAGE_KEYS.REDEMPTIONS, []);
      redemptions = redemptions.filter(r => String(r.coupon_id) !== String(id));
      setJSON(STORAGE_KEYS.REDEMPTIONS, redemptions);
    },

    // --- Pases de Turista ---
    getActivePass: function() {
      const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PASS_ID);
      if (!activeId) return null;
      const passes = getJSON(STORAGE_KEYS.PASSES, []);
      const pass = passes.find(p => String(p.id) === String(activeId));
      if (!pass || pass.status !== 'active' || !pass.expires_at) return null;

      const now = new Date();
      const expires = new Date(pass.expires_at);
      if (now >= expires) {
        pass.status = 'expired';
        setJSON(STORAGE_KEYS.PASSES, passes);
        return null;
      }
      return pass;
    },

    buyPass: function(planKey) {
      if (!PLANS[planKey]) throw new Error('Plan inválido');
      const plan = PLANS[planKey];
      const passes = getJSON(STORAGE_KEYS.PASSES, []);
      const nextId = passes.reduce((max, p) => Math.max(max, p.id || 0), 0) + 1;
      const code = 'KJ-' + generateHex(10);
      const now = new Date();
      const expires = new Date(now.getTime() + plan.hours * 60 * 60 * 1000);

      const newPass = {
        id: nextId,
        pass_code: code,
        plan: planKey,
        price_usd: plan.price,
        payment_amount: plan.price,
        payment_currency: 'USD',
        created_at: now.toISOString(),
        expires_at: expires.toISOString(),
        status: 'active',
        payment_provider: 'demo',
        payment_id: 'DEMO-' + Date.now()
      };

      passes.unshift(newPass);
      setJSON(STORAGE_KEYS.PASSES, passes);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PASS_ID, String(newPass.id));
      this.updateHeaderNav();
      return newPass;
    },

    // --- Canjes (Redemptions) ---
    generateRedemption: function(couponId) {
      const pass = this.getActivePass();
      if (!pass) {
        throw new Error('Necesitás un Kanjealo activo para canjear beneficios.');
      }
      const coupon = this.getCoupon(couponId);
      if (!coupon) throw new Error('Cupón no encontrado.');

      // Check validity
      if (coupon.valid_until) {
        const parts = coupon.valid_until.split('/');
        if (parts.length === 3) {
          const expDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T23:59:59`);
          if (new Date() > expDate) {
            throw new Error('Este beneficio ya no está vigente.');
          }
        }
      }

      const token = 'KC-' + generateHex(8);
      const redemptions = getJSON(STORAGE_KEYS.REDEMPTIONS, []);
      const nextId = redemptions.reduce((max, r) => Math.max(max, r.id || 0), 0) + 1;
      const newRedemption = {
        id: nextId,
        pass_id: pass.id,
        coupon_id: coupon.id,
        redemption_code: token,
        created_at: new Date().toISOString(),
        redeemed_at: null,
        status: 'issued'
      };

      redemptions.unshift(newRedemption);
      setJSON(STORAGE_KEYS.REDEMPTIONS, redemptions);
      return { token, coupon, pass };
    },

    getRedemptionsForPass: function(passId) {
      const redemptions = getJSON(STORAGE_KEYS.REDEMPTIONS, []);
      const coupons = getJSON(STORAGE_KEYS.COUPONS, []);
      return redemptions
        .filter(r => String(r.pass_id) === String(passId))
        .map(r => {
          const c = coupons.find(item => String(item.id) === String(r.coupon_id)) || {};
          return {
            ...r,
            business_name: c.business_name || 'Comercio',
            benefit_text: c.benefit_text || '',
            estimated_savings: c.estimated_savings || 0,
            minimum_purchase: c.minimum_purchase || '',
            valid_until: c.valid_until || ''
          };
        });
    },

    getRedemptionByCode: function(token) {
      const redemptions = getJSON(STORAGE_KEYS.REDEMPTIONS, []);
      const coupons = getJSON(STORAGE_KEYS.COUPONS, []);
      const cleanToken = (token || '').trim().toUpperCase();
      const r = redemptions.find(item => item.redemption_code === cleanToken);
      if (!r) return null;
      const c = coupons.find(item => String(item.id) === String(r.coupon_id)) || {};
      return {
        ...r,
        business_name: c.business_name || 'Comercio',
        benefit_text: c.benefit_text || '',
        estimated_savings: c.estimated_savings || 0,
        minimum_purchase: c.minimum_purchase || '',
        valid_until: c.valid_until || ''
      };
    },

    validateRedemption: function(token) {
      const cleanToken = (token || '').trim().toUpperCase();
      const redemptions = getJSON(STORAGE_KEYS.REDEMPTIONS, []);
      const index = redemptions.findIndex(r => r.redemption_code === cleanToken);
      if (index === -1) {
        return { success: false, message: 'Código de canje inexistente.', result: null };
      }
      const item = redemptions[index];
      if (item.status === 'redeemed') {
        const detailed = this.getRedemptionByCode(cleanToken);
        return { success: false, message: 'Este cupón ya fue utilizado.', result: detailed };
      }

      item.status = 'redeemed';
      item.redeemed_at = new Date().toISOString();
      setJSON(STORAGE_KEYS.REDEMPTIONS, redemptions);

      const detailed = this.getRedemptionByCode(cleanToken);
      return { success: true, message: '¡Cupón validado correctamente!', result: detailed };
    },

    // --- Administración & Auth ---
    loginAdmin: function(username, password) {
      const users = getJSON(STORAGE_KEYS.USERS, []);
      const u = (username || '').trim();
      const user = users.find(item => item.username === u && item.password === password);
      if (user) {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify({ id: user.id, username: user.username }));
        return true;
      }
      return false;
    },

    logoutAdmin: function() {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    },

    isAdminLoggedIn: function() {
      return !!sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    },

    changePassword: function(currentPass, newPass) {
      const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) || '{}');
      const users = getJSON(STORAGE_KEYS.USERS, []);
      const user = users.find(u => u.id === session.id);
      if (!user || user.password !== currentPass) {
        throw new Error('La contraseña actual no es correcta.');
      }
      if (!newPass || newPass.length < 8) {
        throw new Error('La nueva contraseña debe tener al menos 8 caracteres.');
      }
      user.password = newPass;
      setJSON(STORAGE_KEYS.USERS, users);
    },

    getStats: function() {
      const coupons = getJSON(STORAGE_KEYS.COUPONS, []);
      const passes = getJSON(STORAGE_KEYS.PASSES, []);
      const redemptions = getJSON(STORAGE_KEYS.REDEMPTIONS, []);

      return {
        totalCoupons: coupons.length,
        activeCoupons: coupons.filter(c => c.active).length,
        totalPasses: passes.length,
        activePasses: passes.filter(p => p.status === 'active').length,
        redemptionsIssued: redemptions.length,
        redemptionsRedeemed: redemptions.filter(r => r.status === 'redeemed').length
      };
    },

    // --- UI Helpers ---
    showToast: function(msg, type = 'success') {
      let wrap = document.querySelector('.flash-wrap');
      if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'flash-wrap';
        document.body.appendChild(wrap);
      }
      const el = document.createElement('div');
      el.className = `flash ${type}`;
      el.textContent = msg;
      wrap.appendChild(el);
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transition = 'opacity .4s ease';
        setTimeout(() => el.remove(), 400);
      }, 4000);
    },

    updateHeaderNav: function() {
      const pass = this.getActivePass();
      const myPassLink = document.getElementById('nav-my-pass');
      if (myPassLink) {
        myPassLink.style.display = pass ? 'inline-block' : 'none';
      }
    },

    formatDate: function(isoString) {
      if (!isoString) return '';
      try {
        const d = new Date(isoString);
        return d.toLocaleDateString('es-UY', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });
      } catch (e) {
        return isoString;
      }
    }
  };

  // Auto-init on load
  Kanjealo.init();
  window.Kanjealo = Kanjealo;
})();
