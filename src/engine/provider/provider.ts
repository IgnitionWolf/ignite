import Bootstrapper from '../../bootstrapper/bootstrapper';
import Environment from '../../environment/environment';

export interface Provider {
    bootstrapper: Bootstrapper;
    environment: Environment;

    up(): void;
    down(): void;
    status(): string;
    suspend(): void;
    ssh(): void;
    sshConfig(ssh2: boolean): object;
    destroy(): void;
    isInstalled(): boolean;
}

export enum ProviderStatus {
    Running = 'Running',
    Offline = 'Offline',
    Suspended = 'Suspended',
    Unknown = 'Unknown'
}
