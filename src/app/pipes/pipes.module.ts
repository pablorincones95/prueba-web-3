import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncateWalletAddressPipe } from './truncate-wallet-address.pipe';
import { Erc20Pipe } from './erc20.pipe';
import { SponsorByWalletPipe } from './sponsor-by-wallet.pipe';
import { IsUserRegisteredPipe } from './is-user-registered.pipe';
import { HasEnabledMembershipPipe } from './has-enabled-membership.pipe';
import { FromWeiPipe } from './from-wei.pipe';
import { HasBuyPackagesPipe } from './has-buy-packages.pipe';
import { Web3UtilsPipe } from './web3-utils.pipe';
import { UserBlockDocumentPipe } from './user-block-document.pipe';
import { PackageBlockDocumentPipe } from './package-block-document.pipe';
import { PackageIdBlockDocumentPipe } from './package-id-block-document.pipe';
import { HasBuyPackagesBlockPipe } from './has-buy-packages-block.pipe';
import { IsBasicPackagePipe } from './is-basic-package.pipe';
import { UserContractRolesPipe } from './user-contract-roles.pipe';
import { ChainlinkOraclePipe } from './chainlink-oracle.pipe';
import { UserDocFbPipe } from './user-doc-fb.pipe';
import { UserPackFbPipe } from './user-pack-fb.pipe';



@NgModule({
  declarations: [
    TruncateWalletAddressPipe,
    Erc20Pipe,
    SponsorByWalletPipe,
    IsUserRegisteredPipe,
    HasEnabledMembershipPipe,
    FromWeiPipe,
    HasBuyPackagesPipe,
    HasBuyPackagesBlockPipe,
    Web3UtilsPipe,
    UserBlockDocumentPipe,
    PackageBlockDocumentPipe,
    PackageIdBlockDocumentPipe,
    IsBasicPackagePipe,
    UserContractRolesPipe,
    ChainlinkOraclePipe,
    UserDocFbPipe,
    UserPackFbPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TruncateWalletAddressPipe,
    Erc20Pipe,
    SponsorByWalletPipe,
    IsUserRegisteredPipe,
    HasEnabledMembershipPipe,
    FromWeiPipe,
    HasBuyPackagesPipe,
    HasBuyPackagesBlockPipe,
    Web3UtilsPipe,
    UserBlockDocumentPipe,
    PackageBlockDocumentPipe,
    PackageIdBlockDocumentPipe,
    IsBasicPackagePipe,
    UserContractRolesPipe,
    ChainlinkOraclePipe,
    UserDocFbPipe,
    UserPackFbPipe,
  ],
})
export class PipesModule { }
