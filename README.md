# ToramCodex — Toram Online Database

Fan-made database untuk game **Toram Online**, dihosting lewat GitHub Pages.

## 🗂️ Struktur Proyek

```
/
├── index.html            # Homepage — hero, kategori, spotlight, item & monster terbaru
├── css/style.css         # Mobile-first stylesheet (soft gray-white light theme)
├── js/
│   ├── main.js           # Hamburger menu, filter, search, back-to-top, animasi angka
│   ├── sheets.js         # Google Sheets CSV integration + auto icon mapping
│   └── modal.js          # Popup detail card (tanpa reload halaman)
├── pages/
│   ├── items.html        # Database item (senjata, armor, aksesori, material)
│   ├── monsters.html     # Database monster (boss, mini-boss, mob) + tabel drop
│   ├── skills.html       # Database skill (aktif, pasif, combo)
│   ├── maps.html         # Database map / area
│   ├── quests.html       # Database quest (main story, side, daily, event)
│   ├── pets.html         # Database pet (tame, raise, evolve companion pets)
│   └── detail.html       # Item detail fallback (direct link)
└── CHANGELOG.md          # Catatan perubahan
```

## 🎨 Tema & Desain

| Aspek | Detail |
|---|---|
| **Palet warna** | Soft gray-white light theme, aksen goldenrod `#b8860b` |
| **Element colors** | Fire `#d94b1a` · Ice `#2e8bc0` · Wind `#3a9d5e` · Earth `#8b6914` · Dark `#6a0dad` · Light `#d4a017` · Water `#1e7ca8` |
| **Rarity colors** | Common · Uncommon · Rare · Epic · Legendary |
| **Typography** | Segoe UI / system-ui, sans-serif |
| **Layout** | Mobile-first CSS Grid & Flexbox |
| **Navigasi** | Sticky navbar + hamburger drawer di mobile |
| **Komponen** | Card grid, data table, filter bar, pagination, breadcrumb, back-to-top, popup modal |

## ✨ Fitur

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Search bar tersinkron di navbar, mobile drawer, dan hero
- ✅ Filter real-time (nama + kategori + rarity) tanpa reload
- ✅ **Popup modal** untuk detail item (tanpa reload halaman)
- ✅ **Google Sheets integration** — data auto-update dari spreadsheet
- ✅ **Smart icon system** — ImageURL dari Sheet > Icon emoji dari Sheet > auto-detect dari tipe equipment
- ✅ Animated counter stats di hero
- ✅ Soft gray-white light theme — zero external CSS dependency
- ✅ Aksesibilitas: ARIA labels, roles, `aria-expanded`, semantic HTML

## 📊 Google Sheets Setup

1. Buat Google Spreadsheet dengan tab: `Items`, `ItemDetails`, `Monsters`, `Skills`, `Maps`, `Quests`, `Pets`
2. **File → Share → Publish to web** → format CSV
3. Copy Sheet ID dari URL
4. Paste ke `js/sheets.js` → `SHEET_ID`

### Kolom yang diharapkan

| Sheet | Kolom |
|---|---|
| **Items** | Name, Icon, ImageURL, Type, Level, Stats, Rarity, Source |
| **ItemDetails** | Name, Icon, Type, Level, ImageURL, SellSpina, SellOther, Stats, Obtain, Recipe |
| **Monsters** | Name, Icon, ImageURL, Level, Type, Element, HP, Location, Drop |
| **Skills** | Name, Icon, ImageURL, Type, Category, Damage, MP Cost, Description |
| **Maps** | Name, Icon, ImageURL, Zone, LevelRange, Boss, Description |
| **Quests** | Name, Icon, ImageURL, Type, MinLevel, Reward, Description |
| **Pets** | Name, Icon, ImageURL, Element, Level, SpawnAt |
| **Homepage** | Section, Name, Icon, ImageURL, Link, Count, Description, Type, Level, Rarity, Stats, Source |

> **Note:** `Icon` dan `ImageURL` opsional di semua sheet. Jika kosong, sistem otomatis memilih emoji berdasarkan tipe equipment.

### Homepage Sheet — Section Values

| Section | Fungsi | Kolom yang dipakai |
|---|---|---|
| `category` | Card kategori di homepage | Name, Icon, ImageURL, Link, Count |
| `featured` | Spotlight / featured item | Name, Icon, ImageURL, Type, Level, Rarity, Stats, Description, Link |
| `stat` | Counter angka di hero section | Name (label), Count (angka), Icon (suffix, misal "+") |

### Default Icon per Equipment Type

| Type | Icon | | Type | Icon |
|---|---|---|---|---|
| 1-Handed Sword | 🗡️ | | Shield | 🛡️ |
| 2-Handed Sword | ⚔️ | | Armor | 🛡️ |
| Bow | 🏹 | | Ninjutsu Scroll | 📜 |
| Bowgun | 🔫 | | Additional | 💍 |
| Knuckles | 🥊 | | Special | ⭐ |
| Magic Device | 🔮 | | Ring | 💍 |
| Staff | 🪄 | | Material | ⛏️ |
| Halberd | 🔱 | | Monster (Boss) | 🐉 |
| Katana | ⚔️ | | Monster (Normal) | 👾 |
| Dagger | 🔪 | | Skill | ✨ |
| Arrow | 🎯 | | Map | 🗺️ |
| | | | Pet | 🐾 |

## 🚀 GitHub Pages

Aktifkan di **Settings → Pages → Deploy from branch `main`** (root `/`).

---

> **Disclaimer:** ToramCodex adalah proyek fan-made dan tidak berafiliasi dengan Asobimo, Inc.  
> Toram Online™ adalah merek dagang milik Asobimo, Inc.
