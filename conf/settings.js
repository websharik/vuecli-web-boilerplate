const path = require('path')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
const isLocal = process.env.TARGET !== 'remote'

//Заменят публичный путь в проде
const publicPath = isLocal ? '/' : '/'

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist')
}

const ENTRIES = {
  app: `${PATHS.src}/scripts/app.js`
}

const ALIASES = {
  '@templates': path.resolve(`${PATHS.src}/templates`),
  '@scripts': path.resolve(`${PATHS.src}/scripts`),
  '@styles': path.resolve(`${PATHS.src}/styles`),
  '@components': path.resolve(`${PATHS.src}/components`),
  '@views': path.resolve(`${PATHS.src}/components/views`),
  '@static': path.resolve(`${PATHS.src}/static`),
  '@assets': path.resolve(`${PATHS.src}/assets`),
  '@i18n': path.resolve(`${PATHS.src}/i18n`),
  '@store': path.resolve(`${PATHS.src}/scripts/store`)
}

const CONSTANTS = {
  HELLO_WORLD: 'Hello world',
  BASE_URL: publicPath
}

const PAGES = {
  app: {
    entry: path.resolve(`${PATHS.src}/scripts/app.js`),
    template: path.resolve(`${PATHS.src}/templates/app.html`),
    filename: 'app.html',
    chunks: ['vendors', 'app']
  }
}

const DEVSERVER = {
  port: 777,
  proxyTarget: 'https://websharik.ru'
}

const OBFUSCATOR = {
  config: {
    compact: true, //в одну строку
    controlFlowFlattening: false, //усложнение кода (увеличивает размер)
    controlFlowFlatteningThreshold: 1, //сила усложнения 0.0-1.0
    deadCodeInjection: false, //обвес рандомным кодом (увеличивает размер)
    deadCodeInjectionThreshold: 1, //сила обвеса 0.0-1.0
    //debugProtection: true, //мешает работать в devtools
    //debugProtectionInterval: true, //вызывает debug хуки
    //disableConsoleOutput: true, //отключает вывод в консоль
    //domainLock: 'domain.ru', //блокирует запуск на других доменах
    identifierNamesGenerator: 'hexadecimal', //генератор имен
    // hexadecimal: identifier names like _0xabc123
    // mangled: short identifier names like a, b, c
    // mangled-shuffled: same as mangled but with shuffled alphabet
    identifiersDictionary: [],
    identifiersPrefix: '',
    numbersToExpressions: true, //конвертация чисел в выражения 1234 => -0xd93+-0x10b4+0x41*0x67+0x84e*0x3+-0xff8
    renameGlobals: true, //переименовывание названий переменных и функций
    renameProperties: false, //переименовывание свойств и значений (ломает код, лучше не включать)
    reservedNames: [], //свойства и значения которые не будут переименованы (RegExp  format)
    reservedStrings: [], //строки которые не будут переименованы (RegExp  format)
    selfDefending: true, //любое изменение кода сломает его
    simplify: true, //упрощение кода (уменьшает размер логики но делает непонятной)
    //splitStrings: false, //разбивать строки на части
    //splitStringsChunkLength: 8, //длина частей разбитых строк
    stringArray: true, //превращать строки в массивы "Hello World" => _0x12c456[0x1]
    stringArrayEncoding: ['rc4'], //шифрование строк-массивов
    //base64 (легко найти нужное значение)
    //rc4 (30-50% медленнее но сложнее)
    stringArrayThreshold: 1, //как часто строки будут шифроваться в массивы
    //transformObjectKeys: true, //преобразование ключей объекта (выносит ключи и значения в массив а через функцию возвращает, ломает сеттеры/геттеры)
    //unicodeEscapeSequence: false, //преобразование кодировки строк (сильно увеличивает размер но легко обходится)
    //log: false, //логирование
    //sourceMap: false //Obfuscators sourcemaps
    target: 'browser' //где будет использоваться (для лучшего результата) browser, browser-no-eval, node
  },
  excludes: ['scripts/vendors.js']
}

const PRERENDER = {
  items: [
    {
      template: 'app.html',
      name: 'app',
      selector: '#app',
      routes: ['/'],
      inject: {
        //msg: 'Hello world'
      }
    }
  ],
  minify: {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    decodeEntities: true,
    keepClosingSlash: true,
    sortAttributes: true
  },
  renderer: {
    injectProperty: 'isPrerenderer',
    maxConcurrentRoutes: 4,
    headless: false,
    renderAfterDocumentEvent: 'render-event'
  }
}

module.exports = {
  isDev,
  isProd,
  isLocal,
  publicPath,
  PATHS,
  ENTRIES,
  ALIASES,
  CONSTANTS,
  PAGES,
  DEVSERVER,
  OBFUSCATOR,
  PRERENDER
}
