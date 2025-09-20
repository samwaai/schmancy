import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { $LitElement } from '@mixins/index';
import { repeat } from 'lit/directives/repeat.js';
import '@schmancy';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  inStock: boolean;
  discount?: number;
  badge?: string;
}

interface Stat {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  color: string;
}

@customElement('demo-data-display-cards')
export class DataDisplayCards extends $LitElement() {
  @state() private viewMode: 'grid' | 'list' | 'masonry' = 'grid';
  @state() private cardStyle: 'product' | 'stat' | 'profile' | 'article' = 'product';

  private products: Product[] = [
    {
      id: '1',
      name: 'Wireless Headphones',
      description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
      price: 299.99,
      originalPrice: 399.99,
      image: 'https://picsum.photos/400/300?random=1',
      rating: 4.5,
      reviews: 234,
      category: 'Electronics',
      inStock: true,
      discount: 25,
      badge: 'Best Seller'
    },
    {
      id: '2',
      name: 'Smart Watch Pro',
      description: 'Advanced fitness tracking with heart rate monitoring and GPS',
      price: 449.99,
      image: 'https://picsum.photos/400/300?random=2',
      rating: 4.8,
      reviews: 512,
      category: 'Electronics',
      inStock: true,
      badge: 'New'
    },
    {
      id: '3',
      name: 'Laptop Stand',
      description: 'Ergonomic aluminum laptop stand for improved posture',
      price: 79.99,
      image: 'https://picsum.photos/400/300?random=3',
      rating: 4.2,
      reviews: 89,
      category: 'Accessories',
      inStock: false
    },
    {
      id: '4',
      name: 'Mechanical Keyboard',
      description: 'RGB backlit mechanical keyboard with hot-swappable switches',
      price: 159.99,
      originalPrice: 199.99,
      image: 'https://picsum.photos/400/300?random=4',
      rating: 4.7,
      reviews: 156,
      category: 'Accessories',
      inStock: true,
      discount: 20
    },
    {
      id: '5',
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader',
      price: 49.99,
      image: 'https://picsum.photos/400/300?random=5',
      rating: 4.3,
      reviews: 67,
      category: 'Accessories',
      inStock: true
    },
    {
      id: '6',
      name: 'Webcam HD',
      description: '1080p HD webcam with autofocus and noise-cancelling mic',
      price: 89.99,
      image: 'https://picsum.photos/400/300?random=6',
      rating: 4.1,
      reviews: 203,
      category: 'Electronics',
      inStock: true,
      badge: 'Limited Stock'
    }
  ];

  private stats: Stat[] = [
    {
      title: 'Total Revenue',
      value: '$48,574',
      change: 12.5,
      changeLabel: 'vs last month',
      icon: 'payments',
      color: 'primary'
    },
    {
      title: 'New Users',
      value: '3,842',
      change: -5.2,
      changeLabel: 'vs last week',
      icon: 'person_add',
      color: 'secondary'
    },
    {
      title: 'Conversion Rate',
      value: '4.3%',
      change: 8.1,
      changeLabel: 'vs last month',
      icon: 'trending_up',
      color: 'success'
    },
    {
      title: 'Active Sessions',
      value: '1,234',
      change: 0,
      changeLabel: 'no change',
      icon: 'timer',
      color: 'warning'
    }
  ];

  private profiles = [
    {
      name: 'Sarah Johnson',
      role: 'Product Designer',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'Passionate about creating user-centered designs',
      followers: 1234,
      following: 567,
      posts: 89
    },
    {
      name: 'Mike Chen',
      role: 'Full Stack Developer',
      avatar: 'https://i.pravatar.cc/150?img=2',
      bio: 'Building scalable web applications',
      followers: 892,
      following: 234,
      posts: 156
    },
    {
      name: 'Emma Davis',
      role: 'Marketing Manager',
      avatar: 'https://i.pravatar.cc/150?img=3',
      bio: 'Data-driven marketing strategist',
      followers: 2341,
      following: 432,
      posts: 234
    }
  ];

  private articles = [
    {
      title: 'Getting Started with Web Components',
      excerpt: 'Learn the fundamentals of building reusable web components using modern standards.',
      author: 'John Doe',
      date: '2 days ago',
      readTime: '5 min read',
      image: 'https://picsum.photos/600/400?random=7',
      tags: ['Web Dev', 'Tutorial']
    },
    {
      title: 'The Future of Design Systems',
      excerpt: 'Exploring how design systems are evolving to meet the needs of modern applications.',
      author: 'Jane Smith',
      date: '1 week ago',
      readTime: '8 min read',
      image: 'https://picsum.photos/600/400?random=8',
      tags: ['Design', 'UX']
    },
    {
      title: 'Performance Optimization Tips',
      excerpt: 'Practical techniques to improve your web application performance.',
      author: 'Alex Johnson',
      date: '2 weeks ago',
      readTime: '10 min read',
      image: 'https://picsum.photos/600/400?random=9',
      tags: ['Performance', 'Best Practices']
    }
  ];

  private renderProductCard(product: Product) {
    return html`
      <schmancy-surface type="outlined" class="overflow-hidden hover:shadow-lg transition-shadow">
        <div class="relative">
          <img
            src="${product.image}"
            alt="${product.name}"
            class="w-full h-48 object-cover"
          >
          ${product.badge ? html`
            <schmancy-badge
              color="${product.badge === 'New' ? 'primary' : product.badge === 'Best Seller' ? 'success' : 'warning'}"
              class="absolute top-2 left-2"
            >
              ${product.badge}
            </schmancy-badge>
          ` : ''}
          ${product.discount ? html`
            <schmancy-badge color="error" class="absolute top-2 right-2">
              -${product.discount}%
            </schmancy-badge>
          ` : ''}
        </div>

        <div class="p-4">
          <schmancy-chip size="small" class="mb-2">${product.category}</schmancy-chip>

          <schmancy-typography type="headline" token="sm" class="mb-1">
            ${product.name}
          </schmancy-typography>

          <schmancy-typography type="body" token="sm" class="text-surface-onVariant mb-3 line-clamp-2">
            ${product.description}
          </schmancy-typography>

          <div class="flex items-center gap-2 mb-3">
            <div class="flex items-center">
              ${Array.from({ length: 5 }, (_, i) => html`
                <schmancy-icon
                  icon="${i < Math.floor(product.rating) ? 'star' : 'star_outline'}"
                  class="text-warning text-sm"
                ></schmancy-icon>
              `)}
            </div>
            <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
              ${product.rating} (${product.reviews})
            </schmancy-typography>
          </div>

          <div class="flex items-center justify-between mb-3">
            <div>
              <schmancy-typography type="headline" token="sm">
                $${product.price}
              </schmancy-typography>
              ${product.originalPrice ? html`
                <schmancy-typography type="body" token="sm" class="text-surface-onVariant line-through">
                  $${product.originalPrice}
                </schmancy-typography>
              ` : ''}
            </div>
            <schmancy-badge color="${product.inStock ? 'success' : 'error'}">
              ${product.inStock ? 'In Stock' : 'Out of Stock'}
            </schmancy-badge>
          </div>

          <div class="flex gap-2">
            <schmancy-button
              variant="filled"
              ?disabled=${!product.inStock}
              class="flex-1"
            >
              Add to Cart
            </schmancy-button>
            <schmancy-icon-button icon="favorite_outline"></schmancy-icon-button>
          </div>
        </div>
      </schmancy-surface>
    `;
  }

  private renderStatCard(stat: Stat) {
    return html`
      <schmancy-surface type="filled" class="p-6">
        <div class="flex items-start justify-between mb-4">
          <div
            class="p-3 rounded-lg"
            style="background-color: var(--md-sys-color-${stat.color}-container)"
          >
            <schmancy-icon
              icon="${stat.icon}"
              style="color: var(--md-sys-color-on-${stat.color}-container)"
            ></schmancy-icon>
          </div>
          <schmancy-icon-button icon="more_vert" size="small"></schmancy-icon-button>
        </div>

        <schmancy-typography type="body" token="md" class="text-surface-onVariant mb-1">
          ${stat.title}
        </schmancy-typography>

        <schmancy-typography type="headline" token="lg" class="mb-2">
          ${stat.value}
        </schmancy-typography>

        <div class="flex items-center gap-2">
          <schmancy-icon
            icon="${stat.change > 0 ? 'trending_up' : stat.change < 0 ? 'trending_down' : 'trending_flat'}"
            class="${stat.change > 0 ? 'text-success' : stat.change < 0 ? 'text-error' : 'text-surface-onVariant'} text-sm"
          ></schmancy-icon>
          <schmancy-typography
            type="body"
            token="sm"
            class="${stat.change > 0 ? 'text-success' : stat.change < 0 ? 'text-error' : 'text-surface-onVariant'}"
          >
            ${stat.change > 0 ? '+' : ''}${stat.change}%
          </schmancy-typography>
          <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
            ${stat.changeLabel}
          </schmancy-typography>
        </div>
      </schmancy-surface>
    `;
  }

  private renderProfileCard(profile: any) {
    return html`
      <schmancy-surface type="outlined" class="overflow-hidden">
        <div class="bg-primary h-24"></div>
        <div class="px-6 pb-6">
          <div class="flex items-end -mt-12 mb-4">
            <img
              src="${profile.avatar}"
              alt="${profile.name}"
              class="w-24 h-24 rounded-full border-4 border-surface"
            >
            <schmancy-button variant="outlined" size="small" class="ml-auto">
              Follow
            </schmancy-button>
          </div>

          <schmancy-typography type="headline" token="sm" class="mb-1">
            ${profile.name}
          </schmancy-typography>
          <schmancy-typography type="body" token="md" class="text-primary mb-2">
            ${profile.role}
          </schmancy-typography>
          <schmancy-typography type="body" token="sm" class="text-surface-onVariant mb-4">
            ${profile.bio}
          </schmancy-typography>

          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <schmancy-typography type="headline" token="sm">
                ${profile.followers}
              </schmancy-typography>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                Followers
              </schmancy-typography>
            </div>
            <div>
              <schmancy-typography type="headline" token="sm">
                ${profile.following}
              </schmancy-typography>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                Following
              </schmancy-typography>
            </div>
            <div>
              <schmancy-typography type="headline" token="sm">
                ${profile.posts}
              </schmancy-typography>
              <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                Posts
              </schmancy-typography>
            </div>
          </div>
        </div>
      </schmancy-surface>
    `;
  }

  private renderArticleCard(article: any) {
    return html`
      <schmancy-surface type="outlined" class="overflow-hidden hover:shadow-lg transition-shadow">
        <img
          src="${article.image}"
          alt="${article.title}"
          class="w-full h-48 object-cover"
        >
        <div class="p-4">
          <div class="flex gap-2 mb-3">
            ${article.tags.map((tag: string) => html`
              <schmancy-chip size="small">${tag}</schmancy-chip>
            `)}
          </div>

          <schmancy-typography type="headline" token="sm" class="mb-2">
            ${article.title}
          </schmancy-typography>

          <schmancy-typography type="body" token="md" class="text-surface-onVariant mb-4 line-clamp-3">
            ${article.excerpt}
          </schmancy-typography>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <schmancy-avatar size="small"></schmancy-avatar>
              <div>
                <schmancy-typography type="body" token="sm">
                  ${article.author}
                </schmancy-typography>
                <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                  ${article.date} • ${article.readTime}
                </schmancy-typography>
              </div>
            </div>
            <schmancy-icon-button icon="bookmark_outline" size="small"></schmancy-icon-button>
          </div>
        </div>
      </schmancy-surface>
    `;
  }

  render() {
    return html`
      <div class="container mx-auto p-4 max-w-7xl">
        <div class="mb-8">
          <schmancy-typography type="headline" token="lg" class="mb-2">
            Card Layouts
          </schmancy-typography>
          <schmancy-typography type="body" token="lg" class="text-surface-onVariant">
            Various card designs for presenting data
          </schmancy-typography>
        </div>

        <!-- Controls -->
        <schmancy-surface type="filled" class="p-4 mb-6">
          <div class="flex flex-wrap items-center gap-4">
            <schmancy-segmented-button>
              <schmancy-segmented-button-segment
                label="Product"
                ?selected=${this.cardStyle === 'product'}
                @click=${() => this.cardStyle = 'product'}
              ></schmancy-segmented-button-segment>
              <schmancy-segmented-button-segment
                label="Stats"
                ?selected=${this.cardStyle === 'stat'}
                @click=${() => this.cardStyle = 'stat'}
              ></schmancy-segmented-button-segment>
              <schmancy-segmented-button-segment
                label="Profile"
                ?selected=${this.cardStyle === 'profile'}
                @click=${() => this.cardStyle = 'profile'}
              ></schmancy-segmented-button-segment>
              <schmancy-segmented-button-segment
                label="Article"
                ?selected=${this.cardStyle === 'article'}
                @click=${() => this.cardStyle = 'article'}
              ></schmancy-segmented-button-segment>
            </schmancy-segmented-button>

            ${this.cardStyle === 'product' || this.cardStyle === 'article' ? html`
              <schmancy-segmented-button>
                <schmancy-segmented-button-segment
                  icon="grid_view"
                  ?selected=${this.viewMode === 'grid'}
                  @click=${() => this.viewMode = 'grid'}
                ></schmancy-segmented-button-segment>
                <schmancy-segmented-button-segment
                  icon="view_list"
                  ?selected=${this.viewMode === 'list'}
                  @click=${() => this.viewMode = 'list'}
                ></schmancy-segmented-button-segment>
              </schmancy-segmented-button>
            ` : ''}
          </div>
        </schmancy-surface>

        <!-- Cards Grid -->
        ${this.cardStyle === 'product' ? html`
          <div class="${this.viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}">
            ${this.products.map(product =>
              this.viewMode === 'grid' ? this.renderProductCard(product) : html`
                <schmancy-surface type="outlined" class="p-4">
                  <div class="flex gap-4">
                    <img
                      src="${product.image}"
                      alt="${product.name}"
                      class="w-32 h-32 object-cover rounded"
                    >
                    <div class="flex-1">
                      <div class="flex items-start justify-between">
                        <div>
                          <schmancy-typography type="headline" token="sm">
                            ${product.name}
                          </schmancy-typography>
                          <schmancy-typography type="body" token="md" class="text-surface-onVariant">
                            ${product.description}
                          </schmancy-typography>
                        </div>
                        <schmancy-typography type="headline" token="md">
                          $${product.price}
                        </schmancy-typography>
                      </div>
                      <div class="flex items-center justify-between mt-4">
                        <div class="flex items-center gap-2">
                          ${Array.from({ length: 5 }, (_, i) => html`
                            <schmancy-icon
                              icon="${i < Math.floor(product.rating) ? 'star' : 'star_outline'}"
                              class="text-warning text-sm"
                            ></schmancy-icon>
                          `)}
                          <schmancy-typography type="body" token="sm">
                            (${product.reviews})
                          </schmancy-typography>
                        </div>
                        <schmancy-button variant="filled">Add to Cart</schmancy-button>
                      </div>
                    </div>
                  </div>
                </schmancy-surface>
              `
            )}
          </div>
        ` : ''}

        ${this.cardStyle === 'stat' ? html`
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            ${this.stats.map(stat => this.renderStatCard(stat))}
          </div>
        ` : ''}

        ${this.cardStyle === 'profile' ? html`
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${this.profiles.map(profile => this.renderProfileCard(profile))}
          </div>
        ` : ''}

        ${this.cardStyle === 'article' ? html`
          <div class="${this.viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}">
            ${this.articles.map(article =>
              this.viewMode === 'grid' ? this.renderArticleCard(article) : html`
                <schmancy-surface type="outlined" class="p-4">
                  <div class="flex gap-4">
                    <img
                      src="${article.image}"
                      alt="${article.title}"
                      class="w-48 h-32 object-cover rounded"
                    >
                    <div class="flex-1">
                      <div class="flex gap-2 mb-2">
                        ${article.tags.map((tag: string) => html`
                          <schmancy-chip size="small">${tag}</schmancy-chip>
                        `)}
                      </div>
                      <schmancy-typography type="headline" token="sm" class="mb-2">
                        ${article.title}
                      </schmancy-typography>
                      <schmancy-typography type="body" token="md" class="text-surface-onVariant mb-3">
                        ${article.excerpt}
                      </schmancy-typography>
                      <schmancy-typography type="body" token="sm" class="text-surface-onVariant">
                        ${article.author} • ${article.date} • ${article.readTime}
                      </schmancy-typography>
                    </div>
                  </div>
                </schmancy-surface>
              `
            )}
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-data-display-cards': DataDisplayCards;
  }
}