import WhitelistService from '../Services/whitelistService';
var ipRangeCheck = require('ip-range-check');

export default async function validate(req: any): Promise<boolean> {
	let whitelist = await WhitelistService.getWhitelist();
	let studentIP = req.socket.remoteAddress || req.ip || req.clientIp;
	console.log('socket.remoteAddress', req.socket.remoteAddress, '|', 'req.ip', req.ip, '|', 'req.clientIp', req.clientIp);

	let res = ipRangeCheck(studentIP, whitelist.IPs);
	console.log('RESULT', res);

	return res;
}

// ::1/32
// ::1
// :ffff:127.0.0.1
