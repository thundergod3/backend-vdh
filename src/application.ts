import {AuthenticationComponent} from '@loopback/authentication';
import {
    AuthorizationComponent,
    AuthorizationOptions,
} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
    RestExplorerBindings,
    RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import * as admin from 'firebase-admin';
import path from 'path';
import {AuthorizationProvider} from './access-control/interceptor/authorization';
import {UserAccountInterceptor} from './access-control/interceptor/user-account-interceptor';
import {JWTStrategy} from './access-control/strategies/jwt';
import {
    COIN_SERVICE,
    EmailServiceBindings,
    JwtServiceBindings,
    JwtServiceConstants,
    PasswordHasherBindings,
    PAYMENT_SERVICE,
    UserServiceBindings,
} from './config/key';
import {BlacklistCron} from './cronjob';
import {MySequence} from './sequence';
import {
    checkExistStorage,
    CoinService,
    PassportService,
    PaymentService,
} from './services';
import {EmailService} from './services/email.service';
import {JwtService} from './services/jwt.service';
import {PasswordHasherService} from './services/password-hasher.service';

export {ApplicationConfig};
const firebaseCredential = require('../src/config/firebase.json');

export class AppApplication extends BootMixin(
    ServiceMixin(RepositoryMixin(RestApplication)),
) {
    constructor(options: ApplicationConfig = {}) {
        super(options);
        checkExistStorage();
        this.setUpBindings();

        admin.initializeApp({
            credential: admin.credential.cert(firebaseCredential),
            databaseURL: 'https://fir-token-e3a3b.firebaseio.com',
        });

        // Set up the custom sequence
        this.sequence(MySequence);
        this.component(AuthenticationComponent);
        this.component(AuthorizationComponent);
        // this.component(CronComponent);

        // Set up default home page
        this.static('/', path.join(__dirname, '../public'));

        // Customize @loopback/rest-explorer configuration here
        this.configure(RestExplorerBindings.COMPONENT).to({
            path: '/explorer',
        });
        this.component(RestExplorerComponent);

        this.projectRoot = __dirname;
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
        };
    }

    setUpBindings(): void {
        //Bind JWT service
        this.bind(JwtServiceBindings.SECRET_KEY).to(
            JwtServiceConstants.SECRET_KEY,
        );
        this.bind(JwtServiceBindings.TOKEN_EXPIRES_IN).to(
            JwtServiceConstants.EXPIRES_VALUE,
        );
        this.bind(JwtServiceBindings.TOKEN_SERVICE).toClass(JwtService);

        // Bind email service
        this.bind(EmailServiceBindings.EMAIL_SERVICE).toClass(EmailService);

        // Bind password service
        this.bind(PasswordHasherBindings.ROUNDS).to(10);
        this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(
            PasswordHasherService,
        );

        // User acc interceptor
        this.bind(UserAccountInterceptor.BINDING_KEY).toProvider(
            UserAccountInterceptor,
        );

        //Bind authorization
        this.bind(AuthorizationProvider.BINDING_KEY).toProvider(
            AuthorizationProvider,
        );

        //Bind cron job
        this.add(createBindingFromClass(BlacklistCron));
        // Bind strategy
        this.add(createBindingFromClass(JWTStrategy));

        //Bind passport service
        this.bind(UserServiceBindings.PASSPORT_USER_IDENTITY_SERVICE).toClass(
            PassportService,
        );

        // Bind coin service
        this.bind(COIN_SERVICE).toClass(CoinService);
        // Bind payment service
        this.bind(PAYMENT_SERVICE).toClass(PaymentService);
    }

    setUpAuthorization() {
        const option: AuthorizationOptions = {
            // precedence
        };
    }
}
