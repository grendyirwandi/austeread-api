const cron = require('node-cron');
const usersModel = require('../models/Users_model');
const orderModel = require('../models/Order_model');
var axios = require("axios").default;
const notif = require('../controller/Notifications')
const generateId = require('../common/helper/generator_id');

cron.schedule('0 12,17 * * *', () => {
    new notif().userNewsToday();
    console.log("SEND NEWS AUSTEREAD");
});

async function getDataOrder() {
    let dataOrder = await orderModel.getOrderForTransaction();
    return dataOrder;
}

cron.schedule('2 * * * *', async () => {
    let dataOrder = await getDataOrder();
    const statusSuccesPayment = ['settlement', 'SETTLEMENT', 'PAID', 'SUCCESS', 'success']
    for (let i = 0; i < dataOrder.length; i++) {
        const options = {
            method: 'POST',
            url: 'https://api.tdcdigital.id/api/v2/getPaymentStatus',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer UkJJcm5ianJ6QjNoMzBBTkw5YzJtRjJJdHNVRkc2QjA='
            },
            data: {transactionId: dataOrder[i].id}
        };
        try {
            const data = await axios.request(options);
            if (data['data']['Error'] == true) {
                orderModel.updateOrder({status: "PAYMENT FAILED DUE TO TIME OUT"}, dataOrder[i].id);
                continue;
            };
            
            if(!statusSuccesPayment.includes(data['data']['Data']['status']) && data['data']['Data']['status'] != 'PENDING'){
                orderModel.updateOrder({status: "PAYMENT FAILED DUE TO TIME OUT"}, dataOrder[i].id)
                continue;
            }
            
            if (statusSuccesPayment.includes(data['data']['Data']['status'])) {
                if (dataOrder[i]['is_workshop']) {
                    orderModel.updateOrder({status: "SUCCESSFUL PURCHASE"}, dataOrder[i].id)
                    let email = await new usersModel().getEmailByIdPerson(dataOrder[i].id_person);
                    sendMailForWorkshop(dataOrder[i], email);
                } else {
                    orderModel.updateOrder({status: "WAITING FOR SELLER CONFIRMATION"}, dataOrder[i].id)
                    let email = await new usersModel().getEmailByIdPerson(dataOrder[i].id_person);
                    sendMailForProduct(dataOrder[i], email);
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    return true;
});

async function sendMailForProduct(dataOrder, email) {
    let subtotal = 0, order = ``
    for (let idx = 0; idx < dataOrder.order.length; idx++) {
        order += `
        <div style="display: flex; justify-content: left;">
            <div style="padding-left: 10px;">
                <img width="90px" src="${dataOrder.order[idx].productImg}">
            </div>
            <div style="padding-left: 10px; text-align: left; font-size: 15px;">
                <p style="margin-top: 0; margin-bottom: 0;">${dataOrder.order[idx].productTitle}</p>
                <p style="margin-top: 0; margin-bottom: 0;">Choice : ${dataOrder.order[idx].productChoice}</p>
                <p style="margin-top: 0; margin-bottom: 0;">Qty : ${dataOrder.order[idx].productQty}</p>
                <p style="margin-top: 0; margin-bottom: 0;">Price : ${idrDecode(dataOrder.order[idx].productPrice)}</p>
                <p style="margin-top: 0; margin-bottom: 0;">Subtotal item : ${idrDecode(dataOrder.order[idx].productQty * dataOrder.order[idx].productPrice)}</p>
            </div>
        </div>
        <hr>`
        subtotal += dataOrder.order[idx].productQty * dataOrder.order[idx].productPrice
    }
    let data = {
        sender: 'noreply@austeread.com',
        recipient: email.email,
        subject: 'Invoice Order '+ dataOrder.id,
        contents:`
        <table style="margin-left:auto; margin-right:auto; min-width: 320px; max-width: 420px; border: 1px solid rgba(0,0,0,.125);">
            <tr>
                <th colspan="3">
                    <div style="text-align: center;">
                        <div style="display: inline-block;">
                            <img src="https://austeread.teknologi-nusantara.com/assets/austeread/on_white.png" width="50px">
                        </div>
                        <div style="display: inline-block;">
                            <p style="font-size: 40px;margin-top: 0;margin-bottom: 0;">auste<strong>read</strong></p>
                        </div>
                    </div>
                </th>
            </tr>

            <tr>
            <td colspan="3" style="text-align: center; font-weight: bold;">
                <hr>
            </td>
            </tr>

            <tr>
            <td colspan="3" style="text-align: center; font-weight: bold; font-size: 18px;">
                ${dataOrder.id}
            </td>
            </tr>
            <tr>
            <td colspan="3" style="text-align: center; font-size: 15px">
                ${dataOrder.createdAt}
            </td>
            </tr>

            <tr>
                <td colspan="3" style="font-size: 18px; font-weight: bold; ">
                    <div style="padding-left: 10px; padding-top: 20px;">
                        Shipping Details
                    </div>
                </td>
            </tr>
            <tr>
                <td style="font-size: 18px; width: 150px;">
                    <div style="padding-left: 10px;">
                        Shipping to
                    </div>
                </td>
                <td colspan="2" style="font-size: 18px;">
                    <div style="padding-left: 10px; font-weight: bold;">
                        ${dataOrder.name}
                    </div>
                </td>
            </tr>
            <tr>
                <td style="font-size: 18px; width: 150px;">
                    <div style="padding-left: 10px;">
                        Phone Number
                    </div>
                </td>
                <td colspan="2" style="font-size: 18px;">
                    <div style="padding-left: 10px; font-weight: bold;">
                        ${dataOrder.phone}
                    </div>
                </td>
            </tr>
            <tr>
                <td style="font-size: 18px; width: 150px; vertical-align: top;">
                    <div style="padding-left: 10px;">
                        Ship to
                    </div>
                </td>
                <td colspan="2" style="font-size: 18px;">
                    <div style="padding-left: 10px; font-weight: bold;">
                        ${dataOrder.detail_address}
                    </div>
                </td>
            </tr>
            <tr>
                <td style="font-size: 18px; width: 150px;">
                    <div style="padding-left: 10px;">
                        Shipping Method
                    </div>
                </td>
                <td colspan="2" style="font-size: 18px;">
                    <div style="padding-left: 10px; font-weight: bold;">
                        ${dataOrder.courier.toUpperCase() + " - " + dataOrder.service}
                    </div>
                </td>
            </tr>

            <tr>
                <td colspan="3" style="font-size: 18px; font-weight: bold; ">
                    <div style="padding-left: 10px; padding-top: 20px;">
                        Payment Information
                    </div>
                </td>
            </tr>
            <tr>
                <td style="font-size: 18px; width: 150px;">
                    <div style="padding-left: 10px;">
                        Payment Method
                    </div>
                </td>
                <td colspan="2" style="font-size: 18px;">
                    <div style="padding-left: 10px; font-weight: bold;">
                        ${dataOrder.payment_method.toUpperCase()}
                    </div>
                </td>
            </tr>
            <tr>
                <td style="font-size: 18px; width: 150px;">
                    <div style="padding-left: 10px;">
                        Amount
                    </div>
                </td>
                <td colspan="2" style="font-size: 18px;">
                    <div style="padding-left: 10px; font-weight: bold;">
                        ${idrDecode(dataOrder.total)}
                    </div>
                </td>
            </tr>

            <tr>
                <td colspan="3" style="font-size: 18px; font-weight: bold; ">
                    <div style="padding-left: 10px; padding-top: 20px;">
                        Order Summary
                    </div>
                </td>
            </tr>
            <tr>
                <th colspan="3">
                    ${order}
                </th>
            </tr>

            <tr>
                <td style="font-size: 18px; width: 150px;">
                    <div style="padding-left: 10px;">
                        Subtotal
                    </div>
                </td>
                <td colspan="2" style="font-size: 18px;">
                    <div style="padding-left: 10px; padding-right: 10px; font-weight: bold; text-align: right;">
                        ${idrDecode(subtotal)}
                    </div>
                </td>
            </tr>
            <tr>
                <td style="font-size: 18px; width: 150px;">
                    <div style="padding-left: 10px;">
                        Shipping
                    </div>
                </td>
                <td colspan="2" style="font-size: 18px;">
                    <div style="padding-left: 10px; padding-right: 10px; font-weight: bold; text-align: right;">
                        ${idrDecode(dataOrder.shipping_price)}
                    </div>
                </td>
            </tr>
            <tr>
                <td style="font-size: 18px; width: 150px;">
                    <div style="padding-left: 10px;">
                        Total Discount
                    </div>
                </td>
                <td colspan="2" style="font-size: 18px;">
                    <div style="padding-left: 10px; padding-right: 10px; font-weight: bold; text-align: right;">
                        ${idrDecode(dataOrder.discount_price)}
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: center; font-weight: bold;">
                    <hr>
                </td>
            </tr>
            <tr>
                <td style="font-size: 18px; width: 150px;">
                    <div style="padding-left: 10px;">
                        Total
                    </div>
                </td>
                <td colspan="2" style="font-size: 18px;">
                    <div style="padding-left: 10px; padding-right: 10px; font-weight: bold; text-align: right;">
                        ${idrDecode(dataOrder.total)}
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: center; font-weight: bold;">
                    <hr>
                </td>
            </tr>

            <tr>
            <td colspan="3">
                <div style="padding: 0 30px; text-align: center;">
                    <p style="margin-bottom: 5px;">Folow Us On</p>
                    <div>
                        <a href="https://instagram.com/austeread">
                            <img src="https://austeread.teknologi-nusantara.com/assets/austeread/skins/icon_instagram.png" id="icon_instagram" style="width: 35px;">
                        </a>
                        <a href="https://facebook.com/austeread">
                            <img src="https://austeread.teknologi-nusantara.com/assets/austeread/skins/icon_facebook.png" id="icon_facebook" style="width: 35px;">
                        </a>
                        <a href="https://twitter.com/austeread">
                            <img src="https://austeread.teknologi-nusantara.com/assets/austeread/skins/icon_twitter.png" id="icon_twitter" style="width: 35px;">
                        </a>
                        <a href="http://wa.me/6281224853230">
                            <img src="https://austeread.teknologi-nusantara.com/assets/austeread/skins/icon_whatsapp.png" id="icon_whatsapp" style="width: 35px;">
                        </a>
                    </div>
                    <p style="color: #737373;font-style: normal;font-weight: normal;">
                        This email is sent by Austeread automatically.<br>
                        If you do not wish to receive emails like this in the future, please <a href=""
                            class="unsubscribe-link" style="color: #40df60;">unsubscribe</a>
                    </p>
                </div>
            </td>
            </tr>
            <tr>
            <td colspan="3" >
                <div style="color:white; background-color:black; height:90px; padding:10px; font-size:14px; align-items:center; text-align:center;">
                    <p>
                        &copy; 2021 austeread. All rights reserved. Use of this site constitutes acceptance of our User
                        Agreement and Privacy Policy and Cookie Statement and Your Indonesia Privacy Rights.
                    </p>
                </div>
            </td>
            </tr>
        </table>`
    }
    // await new notif().sendEmail(data);
}

async function sendMailForWorkshop(dataOrder, email) {
    const uniqueId = (await generateId.generate(13))['message'];
    let subtotal = 0, order = ``
    for (let idx = 0; idx < dataOrder.order.length; idx++) {
        order += `
        <div style="display: flex; justify-content: left;">
            <div style="padding-left: 10px;">
                <img width="90px" src="${dataOrder.order[idx].productImg}">
            </div>
            <div style="padding-left: 10px; text-align: left; font-size: 15px;">
                <p style="margin-top: 0; margin-bottom: 0;">${dataOrder.order[idx].productTitle}</p>
                <p style="margin-top: 0; margin-bottom: 0;">Qty : ${dataOrder.order[idx].productQty}</p>
                <p style="margin-top: 0; margin-bottom: 0;">Price : ${idrDecode(dataOrder.order[idx].productPrice)}</p>
                <p style="margin-top: 0; margin-bottom: 0;">Unique Id : ${uniqueId}</p>
                <p style="margin-top: 0; margin-bottom: 0;">Subtotal item : ${idrDecode(dataOrder.order[idx].productQty * dataOrder.order[idx].productPrice)}</p>
            </div>
        </div>
        <hr>`
        subtotal += dataOrder.order[idx].productQty * dataOrder.order[idx].productPrice
    }
    let data = {
        sender: 'noreply@austeread.com',
        recipient: email.email,
        subject: 'Invoice Order '+ dataOrder.id,
        contents:`
        <table style="margin-left:auto; margin-right:auto; min-width: 320px; max-width: 420px; border: 1px solid rgba(0,0,0,.125);">
            <tr>
                <th colspan="3">
                    <div style="text-align: center;">
                        <div style="display: inline-block;">
                            <img src="https://austeread.teknologi-nusantara.com/assets/austeread/on_white.png" width="50px">
                        </div>
                        <div style="display: inline-block;">
                            <p style="font-size: 40px;margin-top: 0;margin-bottom: 0;">auste<strong>read</strong></p>
                        </div>
                    </div>
                </th>
            </tr>

            <tr>
            <td colspan="3" style="text-align: center; font-weight: bold;">
                <hr>
            </td>
            </tr>

            <tr>
            <td colspan="3" style="text-align: center; font-weight: bold; font-size: 18px;">
                ${dataOrder.id}
            </td>
            </tr>
            <tr>
            <td colspan="3" style="text-align: center; font-size: 15px">
                ${dataOrder.createdAt}
            </td>
            </tr>

            <tr>
                <td colspan="3" style="font-size: 18px; font-weight: bold; ">
                    <div style="padding-left: 10px; padding-top: 20px;">
                        Payment Information
                    </div>
                </td>
            </tr>
            <tr>
                <td style="font-size: 18px; width: 150px;">
                    <div style="padding-left: 10px;">
                        Payment Method
                    </div>
                </td>
                <td colspan="2" style="font-size: 18px;">
                    <div style="padding-left: 10px; font-weight: bold;">
                        ${dataOrder.payment_method.toUpperCase()}
                    </div>
                </td>
            </tr>
            <tr>
                <td style="font-size: 18px; width: 150px;">
                    <div style="padding-left: 10px;">
                        Amount
                    </div>
                </td>
                <td colspan="2" style="font-size: 18px;">
                    <div style="padding-left: 10px; font-weight: bold;">
                        ${idrDecode(dataOrder.total)}
                    </div>
                </td>
            </tr>

            <tr>
                <td colspan="3" style="font-size: 18px; font-weight: bold; ">
                    <div style="padding-left: 10px; padding-top: 20px;">
                        Order Summary
                    </div>
                </td>
            </tr>
            <tr>
                <th colspan="3">
                    ${order}
                </th>
            </tr>

            <tr>
                <td style="font-size: 18px; width: 150px;">
                    <div style="padding-left: 10px;">
                        Subtotal
                    </div>
                </td>
                <td colspan="2" style="font-size: 18px;">
                    <div style="padding-left: 10px; padding-right: 10px; font-weight: bold; text-align: right;">
                        ${idrDecode(subtotal)}
                    </div>
                </td>
            </tr>
            <tr>
                <td style="font-size: 18px; width: 150px;">
                    <div style="padding-left: 10px;">
                        Total Discount
                    </div>
                </td>
                <td colspan="2" style="font-size: 18px;">
                    <div style="padding-left: 10px; padding-right: 10px; font-weight: bold; text-align: right;">
                        ${idrDecode(dataOrder.discount_price)}
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: center; font-weight: bold;">
                    <hr>
                </td>
            </tr>
            <tr>
                <td style="font-size: 18px; width: 150px;">
                    <div style="padding-left: 10px;">
                        Total
                    </div>
                </td>
                <td colspan="2" style="font-size: 18px;">
                    <div style="padding-left: 10px; padding-right: 10px; font-weight: bold; text-align: right;">
                        ${idrDecode(dataOrder.total)}
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: center; font-weight: bold;">
                    <hr>
                </td>
            </tr>

            <tr>
            <td colspan="3">
                <div style="padding: 0 30px; text-align: center;">
                    <p style="margin-bottom: 5px;">Folow Us On</p>
                    <div>
                        <a href="https://instagram.com/austeread">
                            <img src="https://austeread.teknologi-nusantara.com/assets/austeread/skins/icon_instagram.png" id="icon_instagram" style="width: 35px;">
                        </a>
                        <a href="https://facebook.com/austeread">
                            <img src="https://austeread.teknologi-nusantara.com/assets/austeread/skins/icon_facebook.png" id="icon_facebook" style="width: 35px;">
                        </a>
                        <a href="https://twitter.com/austeread">
                            <img src="https://austeread.teknologi-nusantara.com/assets/austeread/skins/icon_twitter.png" id="icon_twitter" style="width: 35px;">
                        </a>
                        <a href="http://wa.me/6281224853230">
                            <img src="https://austeread.teknologi-nusantara.com/assets/austeread/skins/icon_whatsapp.png" id="icon_whatsapp" style="width: 35px;">
                        </a>
                    </div>
                    <p style="color: #737373;font-style: normal;font-weight: normal;">
                        This email is sent by Austeread automatically.<br>
                        If you do not wish to receive emails like this in the future, please <a href=""
                            class="unsubscribe-link" style="color: #40df60;">unsubscribe</a>
                    </p>
                </div>
            </td>
            </tr>
            <tr>
            <td colspan="3" >
                <div style="color:white; background-color:black; height:90px; padding:10px; font-size:14px; align-items:center; text-align:center;">
                    <p>
                        &copy; 2021 austeread. All rights reserved. Use of this site constitutes acceptance of our User
                        Agreement and Privacy Policy and Cookie Statement and Your Indonesia Privacy Rights.
                    </p>
                </div>
            </td>
            </tr>
        </table>`
    }
    await new notif().sendEmail(data);
}

function idrDecode(num) {
    var str = num.toString().split('.');
    if (str[0].length >= 5){
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1.');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return "Rp "+ str.join('.');
}
