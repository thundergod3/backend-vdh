// Uncomment these imports to begin using these cool features!

import { authenticate } from "@loopback/authentication";
import { authorize } from "@loopback/authorization";
import { inject } from "@loopback/core";
import { repository } from "@loopback/repository";
import {
	get,
	HttpErrors,
	param,
	patch,
	post,
	Request,
	RestBindings,
} from "@loopback/rest";
import { SecurityBindings, securityId, UserProfile } from "@loopback/security";
import { basicAuthorization } from "../access-control/authenticator/basic-authentication";
import { MembershipConstant } from "../config/constants";
import { PAYMENT_SERVICE } from "../config/key";
import {
	MembershipBookingRepository,
	MembershipRepository,
	MembershipUsageRepository,
	UserRepository,
} from "../repositories";
import { PaymentService } from "../services";
@authenticate("jwt")
export class MebershipController {
	constructor(
		@repository(MembershipRepository)
		private memberShipRepository: MembershipRepository,
		@repository(MembershipUsageRepository)
		private usageRepository: MembershipUsageRepository,
		@repository(UserRepository)
		private userRepository: UserRepository,
		@repository(MembershipBookingRepository)
		private mbsBookingRepository: MembershipBookingRepository,
		@inject(SecurityBindings.USER, { optional: true })
		private user: UserProfile,
		@inject(PAYMENT_SERVICE) private paymentService: PaymentService,
		@inject(RestBindings.Http.REQUEST) private request: Request
	) {}

	@get("/membership")
	async getMembership() {
		return this.memberShipRepository.find();
	}

	@post("/membership/register/{membershipId}")
	async registerMembership(
		@param.path.string("membershipId") membershipId: string
	) {
		const membership = await this.memberShipRepository.findById(
			membershipId
		);
		const used: any = await this.usageRepository.findOne({
			where: {
				userId: this.user[securityId],
				membershipId,
			},
		});

		// if (used) {
		// 	throw new HttpErrors.BadRequest("Already registered");
		// }
		const created = new Date();

		// ScheduleService.notifyExpireMbs(created);
		const newUsage: any = await this.usageRepository.create({
			userId: this.user[securityId],
			membershipId,
			status: MembershipConstant.UNPAID,
			createdAt: created,
			outdatedAt: created,
		});
		const trans = await this.usageRepository
			.membershipTransactions(newUsage.id)
			.create({ price: membership.price, createdAt: created });
		// console.log(trans);
		const vnpURL = await this.paymentService.getVNPayURL(
			this.request,
			trans,
			this.user[securityId],
			newUsage.id
		);
		// console.log(vnpURL);
		return { newUsage, ...vnpURL };
	}

	@get("/membership/user")
	async getMembershipOfUser() {
		return this.userRepository
			.membershipUsages(this.user[securityId])
			.find({ include: [{ relation: "membership" }] });
	}

	@patch("/membership/cancel/{membershipId}")
	async cancelMembership(
		@param.path.string("membershipId") membershipId: string
	) {
		const usage = await this.usageRepository.findOne({
			where: { userId: this.user[securityId], membershipId },
		});
		if (!usage) {
			throw new HttpErrors.BadRequest();
		}
		usage.status = MembershipConstant.CANCELED;
		this.usageRepository.update(usage);
		return { message: "Canceled successfully." };
	}

	@patch("/membership/renew/{membershipId}")
	async renewMembership(
		@param.path.string("membershipId") membershipId: string
	) {
		const membership = await this.memberShipRepository.findById(
			membershipId
		);
		const used: any = await this.usageRepository.findOne({
			where: {
				userId: this.user[securityId],
				membershipId,
			},
		});
		if (!used) {
			throw new HttpErrors.BadRequest(
				`You haven't registered to this membership`
			);
		}
		const transaction = await this.usageRepository
			.membershipTransactions(used.id)
			.create({ price: membership.price, createdAt: new Date() });
		// console.log(transaction);
		// console.log(used);
		// console.log(membership);
		const vnpURL = await this.paymentService.getVNPayURL(
			this.request,
			transaction,
			this.user[securityId],
			used.id
		);
		return { ...vnpURL };
	}

	@authorize({
		allowedRoles: ["host"],
		voters: [basicAuthorization],
	})
	@get("membership/bookings")
	async findBookingOfCW(
		@param.query.string("month") month: number
	): Promise<any> {
		let whereCond: any = {};
		if (month) {
			month--;
			const start = new Date(
				new Date(new Date().setMonth(month)).setDate(1)
			);
			const end = new Date(
				new Date(start).setMonth(start.getMonth() + 1)
			);
			whereCond = {
				and: [
					{
						startTime: {
							gte: start,
						},
					},
					{ endTime: { lt: end } },
				],
			};
		}

		let list: any = await this.mbsBookingRepository.find({
			where: {
				host: this.user[securityId],
			},
			include: [
				{
					relation: "booking",
					scope: {
						where: whereCond,
						include: [
							{ relation: "transaction" },
							{ relation: "room" },
						],
					},
				},
				{
					relation: "membershipUsage",
					scope: {
						include: [
							{
								relation: "usage",
								scope: {
									fields: {
										id: true,
										email: true,
										fullname: true,
									},
								},
							},
						],
					},
				},
			],
		});
		let sum = 0;
		list = list.filter((item: any) => {
			if (item.booking) {
				sum += item.booking.transaction.price;
			}
			return item.booking;
		});

		return { list, total: sum };
	}

	@authorize({
		allowedRoles: ["host"],
		voters: [basicAuthorization],
	})
	@patch("/membership/payment")
	async markPayment(@param.query.string("month") month: number) {
		let whereCond: any = {};
		if (month) {
			month--;
			const start = new Date(
				new Date(new Date().setMonth(month)).setDate(1)
			);
			const end = new Date(
				new Date(start).setMonth(start.getMonth() + 1)
			);
			whereCond = {
				and: [
					{
						startTime: {
							gte: start,
						},
					},
					{ endTime: { lt: end } },
				],
			};
		}

		let list: any = await this.mbsBookingRepository.find({
			where: {
				host: this.user[securityId],
			},
			include: [
				{
					relation: "booking",
					scope: {
						where: whereCond,
						include: [
							{ relation: "transaction" },
							{ relation: "room" },
						],
					},
				},
				{
					relation: "membershipUsage",
					scope: {
						include: [
							{
								relation: "usage",
								scope: {
									fields: {
										id: true,
										email: true,
										fullname: true,
									},
								},
							},
						],
					},
				},
			],
		});

		list = list.map(async (item: any) => {
			if (item.booking) {
				item.payment = true;
				delete item.booking;
				delete item.membershipUsage;
				await this.mbsBookingRepository.update(item);
			}
		});
	}
}
