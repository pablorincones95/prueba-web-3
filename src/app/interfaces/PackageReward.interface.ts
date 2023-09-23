export interface PackageRewardConfigSQL {
    id?: number;
    date?: string;
    yieldFarmingPercentage?: number,
    flexiblePercentage?: number;
    createdAt?: number;
    executed?: boolean;
    executedAt?: number | null;
}

export interface PackageRewardConfig extends PackageRewardConfigSQL {
    _id?: string;
}