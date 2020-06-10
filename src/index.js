import React from 'react';
import ReactDOM from 'react-dom';
import loki from 'lokijs';

import App from './App';
import './App.css';

const db = new loki('db');

const users = db.addCollection('users', { indices: ['email'] });

users.insert({
    email: 'user@app.com',
    password: '123',
    role: 'user',
    profile: {
        name: 'Anderson',
        birth: '23/03/1998',
        image: '',
        currencies: ['bsf', 'usd', 'btc'],
        categories: ['freelance'],
        balance: 100
    },
    entries: [
        {
            title: 'prueba',
            date: '05/05/2020',
            type: 'ingreso',
            desc: '',
            category: 'freelance',
            currency: 'usd',
            amount: 120
        },
        {
            title: 'prueba',
            date: '01/06/2020',
            type: 'ingreso',
            desc: '',
            category: 'freelance',
            currency: 'usd',
            amount: 100
        },
        {
            title: 'prueba',
            date: '02/06/2020',
            type: 'ingreso',
            desc: '',
            category: 'donacion',
            currency: 'usd',
            amount: 15
        }
    ]
});

class AppHandler {

    getBalancesByCurrencies() {

        return [
            {
                currency: 'usd',
                amount: '100'
            },
            {
                currency: 'btc',
                amount: '0.0012'
            }
        ]

    }

    addNewCategoryHandler(categories, email = window.sessionStorage.getItem('email')) {
        users.chain().find({email: email}).update({categories: categories});

        return true;
    }

    loginHandler(email, password) {
        const res = users.find({email: email, password: password});
        if(res.length === 0) {
            throw new Error('Datos incorrectos');
        }

        return res[0];
    }

    registerHandler(email, password) {
        const res = users.find({email: email});
        if(res.length > 0) {
            throw new Error('Ya existe un usuario con ese email');
        }

        const newUser = {
            email: email,
            password: password,
            role: 'user',
            profile: {
                name: '',
                birth: '',
                image: '',
                currencies: ['bsf', 'usd'],
                categories: ['freelance'],
            },
            entries: []
        }

        users.insert(newUser);

        return newUser;
    }

    newEntryHandler(entry, email = window.sessionStorage.getItem('email')) {
        const user = users.find({email: email});

        user[0].entries = user[0].entries.concat(entry);
        users.update(user);

        console.log(user);
        console.log(users.find({email: email}));

        return true;
    }

    getAllBalances(email = window.sessionStorage.getItem('email')) {
        const user = users.find({email: email});
        if(user.length === 0) {
            return [];
        }
        return user[0].entries;
    }

    getExpensesPerMonth(month, email = window.sessionStorage.getItem('email')) {
        const user = users.find({email: email});
        if(user.length === 0) {
            return [];
        }
        return user[0].entries;
    }

    getExpensesPerCategory(month, email = window.sessionStorage.getItem('email')) {
        const user = users.find({email: email});
        if(user.length === 0) {
            return [];
        }
        return user[0].entries;
    }

    getExpensesProyection(email = window.sessionStorage.getItem('email')) {
        return [
            {
                month: 'Enero',
                balances: [
                    {currency: 'bsf', amount: '150000'},
                    {currency: 'usd', amount: '100'},
                    {currency: 'btc', amount: '0'}
                ]
            },
            {
                month: 'Febrero',
                balances: [
                    {currency: 'bsf', amount: '0'},
                    {currency: 'usd', amount: '130'},
                    {currency: 'btc', amount: '0.5'},
                ]
            },
            {
                month: 'Marzo',
                balances: [
                    {currency: 'bsf', amount: '0'},
                    {currency: 'usd', amount: '115'},
                    {currency: 'btc', amount: '0'},
                ]
            }

        ]
    }

}

ReactDOM.render(<App appHandler={(new AppHandler())} />, document.getElementById('root'));
