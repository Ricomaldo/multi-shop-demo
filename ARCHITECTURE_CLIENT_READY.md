# 🏗️ ARCHITECTURE CLIENT-READY - TECHNICAL GUIDE

## 📋 OVERVIEW

Ce document détaille l'architecture technique permettant de transformer la plateforme demo en solution client-ready pour livraisons rapides.

## 🎯 OBJECTIFS ARCHITECTURAUX

### **Séparation des Responsabilités**

- **Demo Layer** : Interface de démonstration (existante)
- **Platform Layer** : Logique métier réutilisable
- **Client Layer** : Configuration et customisation client
- **Template Layer** : Sites prêts à livrer

### **Principe de Configuration**

```typescript
// Un seul point de configuration → site client complet
ClientConfig → PlatformProvider → RenderedSite
```

---

## 🔧 ARCHITECTURE TECHNIQUE

### **Structure de Fichiers Cible**

```
frontend/src/
├── config/
│   ├── ClientConfig.ts          # Interface de configuration client
│   ├── UniverseFactory.ts       # Générateur de thèmes client
│   └── TemplateSelector.ts      # Sélection de templates
├── contexts/
│   ├── PlatformContext.tsx      # Provider principal multi-mode
│   ├── StoreContext.tsx         # Store data (optimisé)
│   └── UniverseContext.tsx      # Tokens et thèmes
├── templates/
│   ├── EcommerceTemplate.tsx    # Template e-commerce complet
│   ├── CatalogTemplate.tsx      # Template catalogue simple
│   ├── LandingTemplate.tsx      # Template vitrine
│   └── BookingTemplate.tsx      # Template réservation
├── tools/
│   ├── ClientConfigurator.tsx   # Interface de configuration
│   ├── LivePreview.tsx          # Aperçu temps réel
│   └── CodeGenerator.ts         # Génération de code client
└── [votre code existant]        # Préservé et étendu
```

---

## 📊 INTERFACES DE CONFIGURATION

### **ClientConfig (Interface Principale)**

```typescript
// frontend/src/config/ClientConfig.ts
export interface ClientConfig {
  // Identité et branding
  brand: {
    name: string;
    logo?: string;
    website?: string;
    description?: string;
  };

  // Design basé sur vos universeTokens existants
  universe: {
    baseType: ShopType; // 'brewery' | 'teaShop' | 'beautyShop' | 'herbShop'
    customTokens?: Partial<UniverseTokens>;
    colorOverrides?: {
      primary?: string;
      secondary?: string;
      accent?: string;
    };
  };

  // Modèle business
  business: {
    domain: "ecommerce" | "catalog" | "booking" | "marketplace";
    features: ClientFeature[];
    integrations: Integration[];
    currency?: string;
    locale?: string;
  };

  // Structure de données (basée sur votre seed)
  content: {
    categories: ClientCategory[];
    shopInfo: ClientShopInfo;
    products?: ClientProduct[];
    pages?: ClientPage[];
  };

  // Configuration technique
  deployment: {
    domain?: string;
    analytics?: string;
    cdn?: string;
    environment: "development" | "staging" | "production";
  };
}
```

### **Types Dérivés**

```typescript
// Extensions de vos types existants pour clients
export interface ClientCategory extends Category {
  clientId?: string;
  customFields?: Record<string, any>;
  visibility?: boolean;
}

export interface ClientProduct extends Product {
  clientId?: string;
  customAttributes?: Record<string, any>;
  availability?: {
    inStock: boolean;
    quantity?: number;
    restockDate?: string;
  };
}

export type ClientFeature =
  | "cart"
  | "auth"
  | "reviews"
  | "wishlist"
  | "booking"
  | "inventory"
  | "analytics"
  | "seo"
  | "newsletter";

export type Integration =
  | "stripe"
  | "paypal"
  | "mailchimp"
  | "google-analytics"
  | "facebook-pixel"
  | "calendly";
```

---

## 🏭 FACTORY PATTERN

### **UniverseFactory (Générateur de Thèmes)**

```typescript
// frontend/src/config/UniverseFactory.ts
export class UniverseFactory {
  static generateClientUniverse(config: ClientConfig): UniverseTokens {
    // 1. Récupérer les tokens de base (vos univers existants)
    const baseTokens = getUniverseTokens(config.universe.baseType);

    // 2. Appliquer les surcharges client
    const customColors = this.mergeColors(
      baseTokens.colors,
      config.universe.colorOverrides
    );

    // 3. Adapter les micro-interactions si nécessaire
    const adaptedInteractions = this.adaptMicroInteractions(
      baseTokens.microInteractions,
      config.business.domain
    );

    // 4. Personnaliser les métadonnées
    return {
      ...baseTokens,
      colors: customColors,
      microInteractions: adaptedInteractions,
      meta: {
        ...baseTokens.meta,
        displayName: config.brand.name,
        description: config.brand.description || baseTokens.meta.description,
      },
      // Ajouter des tokens spécifiques client
      client: {
        domain: config.business.domain,
        features: config.business.features,
        customization: config.universe.customTokens,
      },
    };
  }

  private static mergeColors(
    baseColors: UniverseTokens["colors"],
    overrides?: ClientConfig["universe"]["colorOverrides"]
  ) {
    if (!overrides) return baseColors;

    return {
      ...baseColors,
      500: overrides.primary || baseColors[500],
      600: overrides.secondary || baseColors[600],
      400: overrides.accent || baseColors[400],
    };
  }

  private static adaptMicroInteractions(
    base: UniverseTokens["microInteractions"],
    domain: ClientConfig["business"]["domain"]
  ) {
    // Adapter les interactions selon le domaine business
    switch (domain) {
      case "booking":
        return {
          ...base,
          buttonClick: { ...base.buttonClick, scale: 1.05 }, // Plus visible
          inputFocus: { ...base.inputFocus, transition: "all 0.1s ease" }, // Plus rapide
        };
      case "catalog":
        return {
          ...base,
          cardHover: { ...base.cardHover, transform: "scale(1.02)" }, // Plus subtil
        };
      default:
        return base;
    }
  }
}
```

---

## 🎨 TEMPLATE SYSTEM

### **Template Selector**

```typescript
// frontend/src/config/TemplateSelector.ts
export class TemplateSelector {
  static selectTemplate(config: ClientConfig): React.ComponentType<any> {
    switch (config.business.domain) {
      case "ecommerce":
        return EcommerceTemplate;
      case "catalog":
        return CatalogTemplate;
      case "booking":
        return BookingTemplate;
      case "marketplace":
        return MarketplaceTemplate;
      default:
        return EcommerceTemplate; // Default fallback
    }
  }

  static getAvailableFeatures(
    domain: ClientConfig["business"]["domain"]
  ): ClientFeature[] {
    const featureMap: Record<string, ClientFeature[]> = {
      ecommerce: [
        "cart",
        "auth",
        "reviews",
        "wishlist",
        "inventory",
        "analytics",
      ],
      catalog: ["reviews", "wishlist", "analytics", "seo"],
      booking: ["auth", "booking", "analytics"],
      marketplace: ["cart", "auth", "reviews", "inventory", "analytics"],
    };

    return featureMap[domain] || [];
  }
}
```

### **Template Base**

```typescript
// frontend/src/templates/BaseTemplate.tsx
export interface TemplateProps {
  config: ClientConfig;
  children?: React.ReactNode;
}

export abstract class BaseTemplate extends React.Component<TemplateProps> {
  protected getUniverseTokens(): UniverseTokens {
    return UniverseFactory.generateClientUniverse(this.props.config);
  }

  protected renderFeature(feature: ClientFeature): React.ReactNode {
    const FeatureComponent = this.getFeatureComponent(feature);
    return FeatureComponent ? (
      <FeatureComponent config={this.props.config} />
    ) : null;
  }

  private getFeatureComponent(
    feature: ClientFeature
  ): React.ComponentType<any> | null {
    const components = {
      cart: CartComponent,
      auth: AuthComponent,
      reviews: ReviewsComponent,
      wishlist: WishlistComponent,
      booking: BookingComponent,
      inventory: InventoryComponent,
    };

    return components[feature] || null;
  }

  abstract render(): React.ReactNode;
}
```

---

## 🔄 PROVIDER SYSTEM

### **PlatformProvider (Provider Principal)**

```typescript
// frontend/src/contexts/PlatformContext.tsx
interface PlatformContextValue {
  // Mode de fonctionnement
  mode: "demo" | "client";

  // Configuration client (si mode client)
  clientConfig?: ClientConfig;

  // Univers actuel (demo ou client)
  currentUniverse: UniverseTokens;

  // Données store (optimisées)
  storeData: StoreContextValue;

  // Fonctions de contrôle
  switchMode: (mode: "demo" | "client", config?: ClientConfig) => void;
  updateClientConfig: (updates: Partial<ClientConfig>) => void;
}

export function PlatformProvider({
  children,
  initialMode = "demo",
  clientConfig,
}: {
  children: React.ReactNode;
  initialMode?: "demo" | "client";
  clientConfig?: ClientConfig;
}) {
  const [mode, setMode] = useState<"demo" | "client">(initialMode);
  const [config, setConfig] = useState<ClientConfig | undefined>(clientConfig);

  // Générer l'univers selon le mode
  const currentUniverse = useMemo(() => {
    if (mode === "client" && config) {
      return UniverseFactory.generateClientUniverse(config);
    }
    return getUniverseTokens("brewery"); // Demo par défaut
  }, [mode, config]);

  const switchMode = useCallback(
    (newMode: "demo" | "client", newConfig?: ClientConfig) => {
      setMode(newMode);
      if (newMode === "client" && newConfig) {
        setConfig(newConfig);
      }
    },
    []
  );

  const updateClientConfig = useCallback(
    (updates: Partial<ClientConfig>) => {
      if (config) {
        setConfig((prev) => (prev ? { ...prev, ...updates } : undefined));
      }
    },
    [config]
  );

  const value: PlatformContextValue = {
    mode,
    clientConfig: config,
    currentUniverse,
    storeData: {}, // Sera fourni par StoreProvider
    switchMode,
    updateClientConfig,
  };

  return (
    <PlatformContext.Provider value={value}>
      <StoreProvider mode={mode} config={config}>
        <UniverseProvider tokens={currentUniverse}>{children}</UniverseProvider>
      </StoreProvider>
    </PlatformContext.Provider>
  );
}
```

---

## 🛠️ OUTILS DE DÉVELOPPEMENT

### **ClientConfigurator (Interface de Configuration)**

```typescript
// frontend/src/tools/ClientConfigurator.tsx
export function ClientConfigurator() {
  const [config, setConfig] = useState<ClientConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState<
    "brand" | "design" | "business" | "content"
  >("brand");

  return (
    <Flex h="100vh">
      {/* Panel de configuration */}
      <Box
        w="400px"
        borderRight="1px solid"
        borderColor="gray.200"
        overflow="auto"
      >
        <Tabs variant="enclosed" index={tabIndex} onChange={setActiveTab}>
          <TabList>
            <Tab>Brand</Tab>
            <Tab>Design</Tab>
            <Tab>Business</Tab>
            <Tab>Content</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <BrandConfigPanel
                config={config.brand}
                onChange={(brand) => setConfig((prev) => ({ ...prev, brand }))}
              />
            </TabPanel>

            <TabPanel>
              <DesignConfigPanel
                config={config.universe}
                onChange={(universe) =>
                  setConfig((prev) => ({ ...prev, universe }))
                }
                availableUniverses={[
                  "brewery",
                  "teaShop",
                  "beautyShop",
                  "herbShop",
                ]}
              />
            </TabPanel>

            <TabPanel>
              <BusinessConfigPanel
                config={config.business}
                onChange={(business) =>
                  setConfig((prev) => ({ ...prev, business }))
                }
              />
            </TabPanel>

            <TabPanel>
              <ContentConfigPanel
                config={config.content}
                onChange={(content) =>
                  setConfig((prev) => ({ ...prev, content }))
                }
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Aperçu en temps réel */}
      <Box flex="1">
        <LivePreview config={config} />
      </Box>
    </Flex>
  );
}
```

### **Générateur de Code**

```typescript
// frontend/src/tools/CodeGenerator.ts
export class CodeGenerator {
  static async generateClientSite(
    config: ClientConfig
  ): Promise<GeneratedSite> {
    // 1. Sélectionner le template
    const Template = TemplateSelector.selectTemplate(config);

    // 2. Générer l'univers personnalisé
    const universeTokens = UniverseFactory.generateClientUniverse(config);

    // 3. Adapter les données
    const adaptedData = this.adaptDataToClient(config);

    // 4. Générer les fichiers
    const files = await this.generateFiles(
      Template,
      universeTokens,
      adaptedData,
      config
    );

    return {
      files,
      config: universeTokens,
      deploymentConfig: this.generateDeploymentConfig(config),
      readme: this.generateReadme(config),
    };
  }

  private static adaptDataToClient(config: ClientConfig): AdaptedData {
    // Convertir la configuration en données utilisables
    return {
      shops: this.convertShopInfo(config.content.shopInfo),
      categories: config.content.categories,
      products: config.content.products || [],
      pages: config.content.pages || [],
    };
  }

  private static async generateFiles(
    Template: React.ComponentType<any>,
    tokens: UniverseTokens,
    data: AdaptedData,
    config: ClientConfig
  ): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // App.tsx principal
    files.push({
      path: "src/App.tsx",
      content: this.generateAppFile(Template, tokens, config),
    });

    // Configuration tokens
    files.push({
      path: "src/theme/tokens.ts",
      content: this.generateTokensFile(tokens),
    });

    // Données
    files.push({
      path: "src/data/seed.ts",
      content: this.generateSeedFile(data),
    });

    // Configuration Vite/package.json
    files.push(...this.generateConfigFiles(config));

    return files;
  }
}
```

---

## 📈 PERFORMANCE & OPTIMISATION

### **Lazy Loading des Templates**

```typescript
// frontend/src/templates/index.ts
export const EcommerceTemplate = lazy(() => import("./EcommerceTemplate"));
export const CatalogTemplate = lazy(() => import("./CatalogTemplate"));
export const BookingTemplate = lazy(() => import("./BookingTemplate"));

// Preloader pour les templates courants
export const preloadTemplate = (domain: ClientConfig["business"]["domain"]) => {
  switch (domain) {
    case "ecommerce":
      import("./EcommerceTemplate");
      break;
    case "catalog":
      import("./CatalogTemplate");
      break;
    // etc.
  }
};
```

### **Memoization des Tokens**

```typescript
// Éviter la re-génération des tokens à chaque render
export const useMemoizedUniverse = (config: ClientConfig) => {
  return useMemo(
    () => UniverseFactory.generateClientUniverse(config),
    [
      config.universe.baseType,
      config.universe.colorOverrides,
      config.brand.name,
      config.business.domain,
    ]
  );
};
```

---

## 🎯 RÉSUMÉ TECHNIQUE

### **Avantages de cette Architecture**

1. **Séparation claire** : Demo / Platform / Client / Templates
2. **Réutilisabilité maximale** : Vos assets existants exploités
3. **Configuration-driven** : Un fichier → site complet
4. **Évolutivité** : Ajout de templates et features simplifié
5. **Performance** : Lazy loading et memoization
6. **Type-safety** : TypeScript strict sur toute la chaîne

### **Impact sur l'Existant**

- ✅ **Préservation totale** de vos universeTokens
- ✅ **Extension** de votre seed sophistiqué
- ✅ **Optimisation** des performances (contexte unique)
- ✅ **Ajout** de la couche client sans régression

Cette architecture vous permet de passer de "plateforme demo" à "usine à sites client" tout en gardant l'excellence technique actuelle.
