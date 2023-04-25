const fs = require('fs')

// Membuat Folder Data Jika Belum Ada
const dirPath = './data'
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

// Membuat file contacts.json jika belum ada
const dataPath = './data/contacts.json'
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

// Ambil semua data di contact.json
const loadContact = () => {
    const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8')
    const contacts = JSON.parse(fileBuffer)
    return(contacts)
}

// Cari contact berdasarkan nama
const findContact = (nama) => {
    const contacts = loadContact()
    const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase())
    return contact
}

// Menuliskan / menimpa file contacts.json dengan data baru
const saveContacts = (contacts) => {
    fs.writeFileSync('./data/contacts.json', JSON.stringify(contacts, null, 2))
}

// Menambah data contact baru kedalam array
const addContact = (contact) => {
    const contacts = loadContact()
    contacts.push(contact)
    saveContacts(contacts)
}

// Cek nama duplikat
const cekDuplikat = (nama) => {
    const contacts = loadContact()
    return contacts.find((contact) => contact.nama === nama)
}

module.exports = { loadContact, findContact, addContact, cekDuplikat }