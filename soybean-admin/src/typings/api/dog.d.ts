declare namespace Api {
  namespace Dog {
    /**
     * Dog Status
     * - shelter: in shelter
     * - waiting: waiting for adoption
     * - adopted: already adopted
     */
    type Status = 'shelter' | 'waiting' | 'adopted';

    /**
     * Health Status
     * - healthy: good health
     * - sick: needs treatment
     * - critical: emergency care
     */
    type HealthStatus = 'healthy' | 'sick' | 'critical';

    /**
     * Gender
     * - male: 公
     * - female: 母
     */
    type Gender = 'male' | 'female';

    /**
     * Dog Size Category
     * - large: 大型犬
     * - medium: 中型犬
     * - small: 小型犬
     * - other: 其他
     */
    type SizeCategory = 'large' | 'medium' | 'small' | 'other';

    interface DogInfo {
      id: string;
      name: string;
      shelterDate: string;
      size: SizeCategory;
      breed: string;
      gender: Gender;
      color: string;
      weight: number;
      healthStatus: HealthStatus;
      frontPhoto: string;
      sidePhoto: string;
      shoulderHeight: number;
      status: Status;
    }

    /**
     * Dog Query Params
     */
    interface DogSearchParams {
      name?: string;
      status?: Status;
      breed?: string;
    }
  }
}
