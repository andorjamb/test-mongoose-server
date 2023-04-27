import LdapAuth from 'ldapauth-fork';

type welcomeText = {
    cn:string,
    email: string
}

const options = {
    'url': 'ldap://ldap.forumsys.com:389',
    'bindDN': 'cn=read-only-admin,dc=example,dc=com',
    'bindCredentials': 'password',
    'searchBase': 'dc=example,dc=com',
    'searchFilter': 'uid={{username}}'
};
const client = new LdapAuth(options);

// for testing
const username:string = 'galieleo';
const password:string = 'password'; 

export const run = async (username:string, password:string) => new Promise((resolve, reject) => {
    client.authenticate(username, password, (error, user) => {
        if (error) {
            return reject(error);
        }
        return resolve(user);
        
    });
});

const welcome = ({ cn, email }:welcomeText) => {
    console.log(`Welcome, ${cn}!`);
    console.log(`Your e-mail address is "${email}" according to the LDAP server.`);
};

console.log(`
=================================
Test LDAP authenticator with Node
=================================

Authenticating user "${username}" against "${options.url}"...
....${welcome}
`);
