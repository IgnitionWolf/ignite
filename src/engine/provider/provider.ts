import Bootstrapper from '../../bootstrapper/bootstrapper';

export interface Provider {
    bootstrapper: Bootstrapper;
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
