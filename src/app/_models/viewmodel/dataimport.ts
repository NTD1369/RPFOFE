import { MCustomer, MCustomerGroup } from "../customer";
import { MEmployee } from "../employee";
import { TGoodsReceiptLineTemplate } from "../goodreceipt";
import { Item } from "../item";
import { MItemSerialStock } from "../itemserialstock";
import { TItemStorage } from "../itemstorage";
import { MLicensePlate } from "../LicensePlate";
import { LicensePlateHearderTemplate } from "../licensePlatemodel";
import { MMerchandiseCategory } from "../merchandise";
import { MItemGroup } from "../mitemgroup";
import { MItemSerial } from "../mitemserial";
import { MItemUom } from "../mitemuom";
import { MPriceList } from "../mpricelist";
import { MProduct } from "../mproduct";
import { MStoreArea } from "../mstorearea";
import { MStoreCapacity } from "../mstorecapacity";
import { MStorePayment } from "../mstorepayment";
import { MUom } from "../muom";
import { MUserStore } from "../muserstore";
import { MPaymentMethod } from "../paymentmethod";
import { PromotionViewModel } from "../promotion/promotionViewModel";
import { MStorage } from "../storage";
import { MStore } from "../store";
import { MStoreGroup } from "../storegroup";
import { MTableInforTemplate } from "../tableinfo";
import { MTax } from "../tax";
import { MUser, User } from "../user";
import { MWarehouse } from "../warehouse";
import { BOMViewModel } from "./BOMViewModel";
import { Order } from "./order";

export interface CutomerGroupResultViewModel extends MCustomerGroup {
    success: boolean | null;
    message: string;
}
export interface CustomerResultViewModel extends MCustomer {
    success: boolean | null;
    message: string;
}
export interface EmployeeResultViewModel extends MEmployee {
    success: boolean | null;
    message: string;
}
export interface ItemResultViewModel extends Item {
    success: boolean | null;
    message: string;
}
export interface IItemUomResultViewModel extends MItemUom {
    success: boolean | null;
    message: string;
}

export interface ItemGroupResultViewModel extends MItemGroup {
    success: boolean | null;
    message: string;
}

export interface MerchandiseResultViewModel extends MMerchandiseCategory {
    success: boolean | null;
    message: string;
}
export interface PaymentMethodResultViewModel extends MPaymentMethod {
    success: boolean | null;
    message: string;
}
export interface PriceListResultViewModel extends MPriceList {
    success: boolean | null;
    message: string;
}
export interface ProductResultViewModel extends MProduct {
    success: boolean | null;
    message: string;
}
export interface StorageResultViewModel extends MStorage {
    success: boolean | null;
    message: string;
}
export interface StoreResultViewModel extends MStore {
    success: boolean | null;
    message: string;
}
export interface StoreAreaResultViewModel extends MStoreArea {
    success: boolean | null;
    message: string;
}
export interface StoreCapacityResultViewModel extends MStoreCapacity {
    success: boolean | null;
    message: string;
}
export interface StoreGroupResultViewModel extends MStoreGroup {
    success: boolean | null;
    message: string;
}
export interface StorePaymentResultViewModel extends MStorePayment {
    success: boolean | null;
    message: string;
}
export interface TaxResultViewModel extends MTax {
    success: boolean | null;
    message: string;
}
export interface UOMResultViewModel extends MUom {
    success: boolean | null;
    message: string;
}
export interface UserResultViewModel extends MUser {
    success: boolean | null;
    message: string;
}
export interface UserStoreResultViewModel extends MUserStore {
    success: boolean | null;
    message: string;
}
export interface WarehouseResultViewModel extends MWarehouse {
    success: boolean | null;
    message: string;
}
export interface ItemSerialResultViewModel extends MItemSerial {
    success: boolean | null;
    message: string;
}
export interface ItemSerialStockResultViewModel extends MItemSerialStock {
    success: boolean | null;
    message: string;
}
export interface TItemStorageResultViewModel extends TItemStorage {
    success: boolean | null;
    message: string;
}
export interface TGoodsReceiptLineTemplateViewModel extends TGoodsReceiptLineTemplate {
    success: boolean | null;
    message: string;
}
export interface MLicensePlateViewModel extends MLicensePlate {
    success: boolean | null;
    message: string;
}
export class DataImport {
    createdBy: string;
    companyCode: string;
    storeId: string;
    bom: BOMViewModel[];
    customerGroup: MCustomerGroup[];
    customer: MCustomer[];
    item: Item[];
    itemUom: MItemUom[];
    itemSerial: MItemSerial[];
    itemSerialStock: MItemSerialStock[];
    employee: MEmployee[];
    itemGroup: MItemGroup[];
    merchandise: MMerchandiseCategory[];
    paymentMethod: MPaymentMethod[];
    priceList: MPriceList[];
    product: MProduct[];
    storage: MStorage[];
    store: MStore[];
    storeArea: MStoreArea[];
    storeCapacity: MStoreCapacity[];
    storeGroup: MStoreGroup[];
    storePayment: MStorePayment[];
    tax: MTax[];
    uom: MUom[];
    user: MUser[];
    userStore: MUserStore[];
    warehouse: MWarehouse[];  
    itemStorage: TItemStorage[];  
    so: Order[];  
    promotion: PromotionViewModel[];  
    goodsReceiptImport: TGoodsReceiptLineTemplate[];  
    licensePlate :MLicensePlate[];
    licensePlateImport :LicensePlateHearderTemplate[];
    tableInfor: MTableInforTemplate[];
}