const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const { loadContact, findContact, addContact, cekDuplikat } = require('./utils/contacts')

const { body, validationResult, check } = require('express-validator');

const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const app = express()
const port = 3000

// EJS
app.set('view engine', 'ejs');

// Third-party Middleware 
app.use(expressLayouts);

// Built-in Middleware
app.use(express.static('public'))

// Parse data URL
app.use(express.urlencoded({ extended: true }))

// Konfigurasi Flash
app.use(cookieParser('secret'))
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
)
app.use(flash())

app.get('/', (req, res) => {
    // res.sendFile('./index.html', { root: __dirname })
    const mahasiswa= [
        {
            nama: 'Nico Abel Laia',
            email: 'nico@gmail.com'
        },
        {
            nama: 'Rico',
            email: 'rico@gmail.com'
        },
        {
            nama: 'Miceel',
            email: 'micel@gmail.com'
        },
    ]
    res.render('index', { 
        nama: 'Nico Abel Laia', 
        layout: 'layouts/main-layout',
        title: 'Halaman Home',
        mahasiswa })
})

app.get('/about', (req, res) => {
    res.render('about', { 
        layout: 'layouts/main-layout',
        title: 'Halaman About' 
    })
})

app.get('/contact', (req, res) => {
    const contacts = loadContact()
    res.render('contact', { 
        layout: 'layouts/main-layout',
        title: 'Halaman Contact', 
        contacts,
        msg: req.flash('msg')
    })
})

// Halaman tambah data
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: 'Form tambah data contact',
        layout: 'layouts/main-layout'
    })
})

// Proses data contact
app.post('/contact', [
    body('nama').custom((value) => {
        const duplikat = cekDuplikat(value)
        if (duplikat) {
            throw new Error('Nama contact sudah ada!')
        }
        return true
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('nohp', 'Nomor HP tidak valid!').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('add-contact', {
            title: 'Form Tambah Data Contact',
            layout: 'layouts/main-layout',
            errors: errors.array()
        })
        // return res.status(400).json({ errors: errors.array() })
    }
    else {
        addContact(req.body)
        req.flash('msg', 'Data Contact berhasil ditambahkan!')
        res.redirect('/contact')
    }
})

// Halaman detail contact
app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama)

    res.render('detail', {
        title: 'Halam Detail Contact',
        layout: 'layouts/main-layout',
        contact
    })
})

app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>404</h1>')
})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
})
