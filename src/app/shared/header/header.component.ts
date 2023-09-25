import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Web3Service } from "src/app/services/contract/web3.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  loginUser: boolean = false;
  addressUser: string = "";
  addressUserView: boolean = false;
  constructor(
    private contractService: Web3Service,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // nos subscribimos a la cuenta de la wallet para obtener la direccion
    this.contractService.accountStatus$.subscribe((res: string) => {
      this.addressUser = res;
      console.log(this.addressUser[0]);
      this.cdr.detectChanges();
    });
  }

  // funncion para conectar la wallet
  async connectWallet() {
    this.contractService.connectAccount();
  }
}
