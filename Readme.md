# RadCtl Frontend

Фронтенд-часть системы управления доступом на активное оборудование RadCTL. 

## ✨ Особенности
- Личный кабинет пользователя
- Управления пользователями
- Управление городами
- Управление адресами и зонами
- Интеграция с RadCtl Backend API

## 🛠 Технологии
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=fff)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![HTML](https://img.shields.io/badge/HTML-E34F26?logo=html5&logoColor=fff)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-7C3AED?logoColor=fff)](https://ui.shadcn.com)
[![Lucide](https://img.shields.io/badge/Lucide-f56565?logoColor=fff)](https://lucide.dev)

## 🚀 Быстрый старт

### Предварительные требования
- Node.js ≥18.x
- npm ≥9.x

### Установка
```bash
git clone ssh://git@gitlab.domru.ru:2222/noc_tech/radctl/radctl_front.git
npm install
```
### Взаимодействие
```
npm run dev - запуск сервера локально на хосте (localhost:5173)
npm run build - сборка проекта
```

### Структура

```
radctl-front/
├── public/                                 # Статические ресурсы
│   └── icon-bar.png                        # Иконка сайта в бане браузера
├── src/
│   ├── app/                                # Директория всей логики приложения
│   │   ├── assets/                         # Иконки и изображения
│   │   ├── components/                     # Компоненты логики приложения
│   │   │   ├── admin/                      # Компоненты админки
│   │   │   │   ├── AdmNavNetworks.jsx      # Компонент навигации админки на странице сетей
│   │   │   │   ├── AdmNavRadUsers.jsx      # Компонент навигации админки на странице пользователей радиус
│   │   │   │   ├── LayoutNetworks.jsx      # Компонент соединения навбара сетей и страниц с таблицами сетей
│   │   │   │   └── LayoutRadUsers.jsx      # Компонент соединения навбара пользователей и страниц с таблицами пользователей
│   │   │   ├── home/                       # Компоненты главной страницы
│   │   │   │   ├── UserAccessCards.jsx     # Компонент карточки доступа пользователя на главной странице
│   │   │   │   └── UserProfileCard.jsx     # Компонент карточки информации пользователя и его доступных сессиях на главной странице
│   │   │   ├── tables/                     # Компоненты таблиц
│   │   │   │   ├── CrudDialog.jsx          # Компонент для добавления пользователей (связан с TableActionBar.jsx)
│   │   │   │   ├── TableActionBar.jsx      # Компонент кнопки действия в таблице (добавление записей)
│   │   │   │   ├── TableContextMenu.jsx    # Компонент контекстного меню для вазимодйствия с записями в таблице
│   │   │   │   ├── TableFooter.jsx         # Компонент отображения показанных записей и выделенных записей
│   │   │   │   └── VirtualizedTable.jsx    # Главный элемент таблицы, в котором происходит рендеринг всех записей
│   │   │   ├── Layout.jsx                  # Компонент соединения навбара и всех страниц
│   │   │   └── Navbar.jsx                  # Навигационное меню 
│   │   ├── pages/                          # Страницы приложения
│   │   │   ├── admin/                      # Страницы админки
│   │   │   │   ├── City.jsx                # Страница городов
│   │   │   │   ├── Network.jsx             # Страница сетей
│   │   │   │   ├── RadUsers.jsx            # Страница пользователей
│   │   │   │   ├── Responsibilities.jsx    # Страница зон
│   │   │   │   └── TrustedIps.jsx          # Страница доверенных IP
│   │   │   ├── AuthForm.jsx                # Страница авторизации
│   │   │   ├── ChangePass.jsx              # Страница смены пароля
│   │   │   └── HomePage.jsx                # Главная страница
│   │   ├── services/                       # Сервисы API запросов
│   │   │   ├── auth/                       # Сервисы авторизации, переавторизации, выхода
│   │   │   ├── city/                       # Сервисы городов
│   │   │   ├── networks/                   # Сервисы сетей
│   │   │   ├── protect/                    # Сервисы защиты от неавторизованного доступа
│   │   │   └── users/                      # Сервисы пользователей
│   │   ├── styles/                         # Стили приложения
│   │   └── App.jsx                         # Корень логики приложения
│   ├── components/                         # Компоненты библиотеки Shad/cn
│   │   ├── ui/                             # Компоненты библиотеки Shad/cn
│   │   └── theme-provider.jsx              # Провайдер темы
│   ├── lib/                                # Библиотека Shad/cn
│   └── main.jsx                            # Корень React приложения
├── .gitignore                              # Игнорируемые файлы
├── eslint.config.js                        # Конфиг ESLint
├── index.html                              # Основной HTML-файл
├── package.json                            # Зависимости и скрипты
└── vite.config.ts                          # Конфиг Vite
```