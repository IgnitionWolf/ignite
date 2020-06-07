import Bootstrapper from '../../bootstrapper/bootstrapper';
import Environment from '../../environment/environment';

export interface Provider {
    bootstrapper: Bootstrapper;
    environment: Environment;

    up(): void;
    ssh(): void;
    down(): void;
    suspend(): void;
    destroy(): void;
    status(): void;
    isInstalled(): void;
    sshConfig(ssh2: boolean): object;
    installPlugin(plugins: Array<string>): void;
}

export enum ProviderStatus {
    Running = 'Running',
    Offline = 'Offline',
    Suspended = 'Suspended',
    Unknown = 'Unknown'
}
