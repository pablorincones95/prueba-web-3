import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TruncateWalletAddressPipe } from "./truncate-wallet-address.pipe";
import { FromWeiPipe } from "./from-wei.pipe";
import { Web3UtilsPipe } from "./web3-utils.pipe";

@NgModule({
  declarations: [TruncateWalletAddressPipe, FromWeiPipe, Web3UtilsPipe],
  imports: [CommonModule],
  exports: [TruncateWalletAddressPipe, FromWeiPipe, Web3UtilsPipe],
})
export class PipesModule {}
