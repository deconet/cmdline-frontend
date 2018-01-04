import program from 'commander'
import Inquirer from 'inquirer'
import Utils from './utils'
import Functions from './functions'


program
  .version('0.0.1')
  .description('The Deconet command line client.  You can buy and sell code with Deconet.');

program
  .command('register')
  .alias('r')
  .description('Register an account with Deconet')
  .action(() => {
    const questions = [
      {
        type : 'input',
        name : 'email',
        message : 'Enter your email address: '
      },
      {
        type : 'password',
        name : 'password',
        message : 'Enter a password: ',
        mask: '*',
        validate: Utils.requireLetterAndNumber
      }
    ]
    Inquirer.prompt(questions).then(answers => {
      console.log('email: ' + answers.email)
      console.log('password: ' + answers.password)
      Functions.register(answers.email, answers.password)
    })
  });

program
  .command('getContact <name>')
  .alias('r')
  .description('Get contact')
  .action(name => console.log(name));

program.parse(process.argv);