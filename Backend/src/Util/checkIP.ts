import IWhitelist from "../Models/IWhitelist";
import WhitelistService from "../Services/whitelistService";


export default async function validate(req: any): Promise<boolean> {
  let whitelist = await WhitelistService.getWhitelist();
  let studentIP: any = req.headers['x-forwarded-for']?.split(',').shift()
    || req.socket?.remoteAddress || req.ip;

  console.log('WHITELIST', whitelist.IPs);
  console.log('STUDENTIP', studentIP);

  return whitelist.IPs.filter((ip: string) => ip.toString() === studentIP.toString());
}