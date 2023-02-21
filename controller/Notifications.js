'use strict';
const Controller = require('../core/Controller');
const configEmail = require('../config/email');
const nodemailer = require('nodemailer');
const fs = require('fs'),
    path = require('path');
const moment = require("moment");
const _ = require('lodash');

class Notifications extends Controller {
    constructor(req, res) {
        super(res);
        this.req = req;
        this.users_model = this._model('Users_model');
    }

    async shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async sendEmail(data) {
        const transporter = nodemailer.createTransport(configEmail);

        const mailOptions = {
            from: "Austeread "+data.sender,
            to: data.recipient,
            subject: data.subject,
            html: data.contents
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return true
    }

    async userNewsToday() {
        const date = moment().format("Do MMMM, YYYY");

        let news = await this.users_model.getNewsForEmail();
        news = await this.shuffle(news);
        const newsToday = news.slice(0, 3);

        const headerFilePath = path.join(__dirname, '/../common/html/header_email.html');
        const footerFilePath = path.join(__dirname, '/../common/html/footer_email.html');

        const headerHtml = await fs.readFileSync(headerFilePath, 'utf-8');
        const foorterHtml = await fs.readFileSync(footerFilePath, 'utf-8');

        if (news.length == 0) return false;

        let whatsOnToday = '<div class="news-section" style="display: block;position: relative;">' +
            `<p class="news-section-title">What's on today</p>` +
            '</div>';

        for (const key in newsToday) {
            whatsOnToday += '<div class="row" style="display: inline-flex;width: 100%;text-align: left;">' +
                '<div style="padding-right: 10px;padding-top: 10px;position: relative;padding: 10px;">' +
                `<img class="article-image" src="${process.env.HOST}assets/img/upload/${newsToday[key].thumbnail}" alt="${newsToday[key].title}" style="width: 180px;">` +
                '</div>' +
                '<div style="padding-right: 10px;padding-top: 10px;position: relative;">' +
                `<label for="" class="article-date" style="font-size: 11px;font-weight: 600;display: block;height: auto;padding-bottom: 5px;width: 100%;border-bottom: 2px solid #9c27b0;">${newsToday[key]["tbl_news_category"]["name"]} | ${newsToday[key].createdAt}</label>` +
                `<p class="article-title" style="font-size: 14px;text-align: left;color: #3d3d3d;margin-top: 8px;">${newsToday[key].title}</p>` +
                `<a class="article-btn-readmore" href="${process.env.HOST}news/${newsToday[key].id}" style="display: flex;width: 100%;align-items: center;justify-content: center;height: 30px;text-align: center;border: 1px solid #40DF60;text-decoration: none;color: #40DF60;">Read More</a>` +
                '</div>' +
                '</div>'
        }

        const users = await this.users_model.getUserWithSubNews();

        if (users.length === 0) return false;

        for (const key in users) {
            const arrSubNews = JSON.parse(users[key].subNews)
            let isSendMail = true;
            let contentHtml = '';

            for (const index in arrSubNews) {
                const tempNews = _.filter(news, {
                    'category': arrSubNews[index]
                });

                if (tempNews.length === 0) {
                    isSendMail = false;
                    break;
                }

                contentHtml += '<div class="news-section" style="display: block;position: relative;">' +
                    `<p class="news-section-title">${tempNews[0]["tbl_news_category"]["name"]}</p>` +
                    '</div>';

                for (const indexNews in tempNews) {
                    contentHtml += '<div class="row" style="display: inline-flex;width: 100%;text-align: left;">' +
                        '<div style="padding-right: 10px;padding-top: 10px;position: relative;padding: 10px;">' +
                        `<img class="article-image" src="${process.env.HOST}assets/img/upload/${tempNews[indexNews].thumbnail}" alt="${tempNews[indexNews].title}" style="width: 180px;">` +
                        '</div>' +
                        '<div style="padding-right: 10px;padding-top: 10px;position: relative;">' +
                        `<label for="" class="article-date" style="font-size: 11px;font-weight: 600;display: block;height: auto;padding-bottom: 5px;width: 100%;border-bottom: 2px solid #9c27b0;">${tempNews[indexNews]["tbl_news_category"]["name"]} | ${tempNews[indexNews].createdAt}</label>` +
                        `<p class="article-title" style="font-size: 14px;text-align: left;color: #3d3d3d;margin-top: 8px;">${tempNews[indexNews].title}</p>` +
                        `<a class="article-btn-readmore" href="${process.env.HOST}news/${tempNews[indexNews].id}" style="display: flex;width: 100%;align-items: center;justify-content: center;height: 30px;text-align: center;border: 1px solid #40DF60;text-decoration: none;color: #40DF60;">Read More</a>` +
                        '</div>' +
                        '</div>'
                }
            }

            if (isSendMail) {
                await this.sendEmail({
                    "sender": "noreply@austeread.com",
                    "recipient": users[key].email,
                    "subject": "Austeread News " + date,
                    "contents": headerHtml + whatsOnToday + contentHtml + foorterHtml
                })

                await this.users_model.updateLastSendEmail(users[key].id);
            }
        }

        return true;
    }
}


module.exports = Notifications;