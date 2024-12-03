import nodemailer, { Transporter } from 'nodemailer';

export interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachements?: Attachement[];
}

export interface Attachement {
    filename: string;
    path: string;
}


export class EmailService {

    private transporter: Transporter;

    constructor(mailerSerivce: string, mailerEmail: string, mailerSecretKey: string, private readonly postToProvider: boolean) {
        this.transporter = nodemailer.createTransport({
            service: mailerSerivce,
            auth: {
                user: mailerEmail,
                pass: mailerSecretKey,
            }
        });
    }


    async sendEmail(options: SendMailOptions): Promise<boolean> {

        const { to, subject, htmlBody, attachements = [] } = options;


        try {
            //TODO: Si lo que se quiere es probar el envio de correos, se puede descomentar la siguiente linea
            // if (!this.postToProvider) {
            //     return true;
            // }

            const sentInformation = await this.transporter.sendMail({
                to: to,
                subject: subject,
                html: htmlBody,
                attachments: attachements,
            });

            // console.log( sentInformation );

            return true;
        } catch (error) {
            return false;
        }

    }





}