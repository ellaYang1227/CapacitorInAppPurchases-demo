import { ChangeDetectorRef, Component, inject } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import { AlertController, Platform } from '@ionic/angular';
import 'cordova-plugin-purchase';

const PRODUCT_CONSUMABLE_KEY = 'testConsumableV1';
const PRODUCT_NON_CONSUMABLE_KEY = 'testNonConsumableV1';
const PRODUCT_AUTO_SUBSCRIPTION_KEY = 'testAutoRenewableSubscriptionsV1';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  platform = inject(Platform);
  alertController = inject(AlertController);
  ref = inject(ChangeDetectorRef);

  store!: CdvPurchase.Store;
  products: CdvPurchase.Product[] = [];
  gems = 0;
  isPro = false;
  subscriptionNum = 0;

  constructor() {
    console.log('constructor')
    this.platform.ready().then(() => {
      if (Capacitor.getPlatform() !== 'web') {
        this.store = CdvPurchase.store;

        // 註冊產品
        this.registerProducts();
  
        // 獲取真實的產品訊息
        this.store.ready(() => {
          this.products = this.store.products;
          console.log('this.products2', this.products)
          this.ref.detectChanges();
        });
      }
    });
  };

  //註冊產品
  registerProducts(): void {
    console.log('registerProducts', this.store)
    this.store.register([{
      type: CdvPurchase.ProductType.CONSUMABLE,
      id: PRODUCT_CONSUMABLE_KEY,
      platform: CdvPurchase.Platform.APPLE_APPSTORE
    }, {
      type: CdvPurchase.ProductType.NON_CONSUMABLE,
      id: PRODUCT_NON_CONSUMABLE_KEY,
      platform: CdvPurchase.Platform.APPLE_APPSTORE
    }, {
      type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
      id: PRODUCT_AUTO_SUBSCRIPTION_KEY,
      platform: CdvPurchase.Platform.APPLE_APPSTORE
    }
  ]);

    this.store.error((error: CdvPurchase.IError) => {
      console.log('發生 error', error)
      // 6777006 - The user cancelled the order - 用戶取消訂單
      // 6777003 - Purchase failed 購買失敗

      this.presentAlert('錯誤訊息', error.message);
    });

    this.setupListeners();
    this.store.initialize();
  }

  // 設定監聽器
  setupListeners(): void{
    // 所有產品的通用查詢
    console.log('所有產品的通用查詢')
    this.store.when()
      // 註冊產品更新時呼叫的函數
      .productUpdated((product: CdvPurchase.Product) => {
        console.log('產品更新', product)
      })
      // 註冊交易被批准時呼叫的函數
      .approved((transaction: CdvPurchase.Transaction) => transaction.verify())
      // 完成 - 返回此收據中的最後一筆交易
      .finished((transaction: CdvPurchase.Transaction) => {
        const { state, products } = transaction;
        if (state === 'finished') {
          // 處理產品交付
          products.forEach(product => {
            const { id } = product;
            if (id === PRODUCT_NON_CONSUMABLE_KEY) {
              this.isPro = true;
            } else if (id === PRODUCT_CONSUMABLE_KEY) {
              this.gems += 100;
            } else if (id === PRODUCT_AUTO_SUBSCRIPTION_KEY) {
              this.subscriptionNum ++;
            }
          });

          // 更新畫面
          this.ref.detectChanges();
        }
      })
      // 註冊一個在驗證收據時呼叫的函數
      .verified((verifiedReceipt: CdvPurchase.VerifiedReceipt) => verifiedReceipt.finish());
  }

  // 購買
  purchase(productId: CdvPurchase.Product['id']): void {
    this.store.get(productId)?.getOffer()?.order().then(res => {
      if(res?.isError) {
        console.error('IAP 購買失敗');
      } else {
        console.log('購買進行中！')
      }
    });
  }

  // 重播用戶交易
  async restorePurchases(): Promise<void> {
    await this.store.restorePurchases();
  }

  async presentAlert(header: string, message: CdvPurchase.IError['message']) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['關閉']
    });

    await alert.present();
  }
}